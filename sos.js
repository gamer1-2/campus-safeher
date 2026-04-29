
document.addEventListener('DOMContentLoaded', () => {
  const token   = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // ── Auth & role guard ──────────────────────────────────────
  if (!token || !userStr) { window.location.href = 'index.html'; return; }
  const user = JSON.parse(userStr);
  if (user.role !== 'admin') {
    alert('Access Denied. Admin privileges required.');
    window.location.href = 'home.html';
    return;
  }

  // ── Logout ─────────────────────────────────────────────────
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // ── Map state ──────────────────────────────────────────────
  let adminMap       = null;
  let mapInitialized = false;
  let liveTrackTimer = null;

  // userId (string) → { marker, infoWindow }
  const markerRegistry = new Map();
  // userId (string) → normalised location object  (source of truth for stats)
  const locationCache  = new Map();

  // ── Leaflet Maps Initialization ────────────────────────────
  function initAdminMap() {
    const mapDiv = document.getElementById('admin-map');
    if (!mapDiv) return;

    adminMap = L.map('admin-map').setView([20.5937, 78.9629], 14);

    // Dark theme map tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(adminMap);

    mapInitialized = true;

    // Render any socket data that arrived before the map was ready
    if (locationCache.size > 0) syncCacheToMap();

    startLiveTracking();
  }

  // Initialize immediately
  initAdminMap();

  // ── Polling ────────────────────────────────────────────────
  function startLiveTracking() {
    fetchLiveLocations();
    liveTrackTimer = setInterval(fetchLiveLocations, 5000);
  }

  // Fallback: still poll even if Maps API key is missing
  setTimeout(() => { if (!mapInitialized) startLiveTracking(); }, 4000);

  // ── Initial table loads ────────────────────────────────────
  fetchSOSAlerts();
  fetchEmergencies();
  fetchReports();

  // ── Socket.IO ─────────────────────────────────────────────
  if (typeof io !== 'undefined') {
    const socket = io(SOCKET_URL);

    // INSTANT update: one user's location changed
    socket.on('live_location_update', (data) => {
      patchMarkerFromSocket(data);
    });

    // INSTANT SOS: one user triggered SOS
    socket.on('sos_triggered', (data) => {
      patchMarkerFromSocket(data);
      fetchSOSAlerts(); // also refresh the alert table
    });

    // Generic signal: refresh everything (e.g. SOS resolved)
    socket.on('sos_updated',       () => { fetchSOSAlerts(); fetchLiveLocations(); });
    socket.on('emergency_updated', () => fetchEmergencies());
    socket.on('report_updated',    () => fetchReports());
  }

  // ══════════════════════════════════════════════════════════
  //  FETCH
  // ══════════════════════════════════════════════════════════

  async function fetchLiveLocations() {
    try {
      const res = await fetch(`${API_URL}/admin/live-locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const locations = await res.json();
      reconcileMarkers(locations);   // full sync: adds, updates, removes
      updateLiveStats();
    } catch (err) {
      console.error('Error fetching live locations:', err);
    }
  }

  async function fetchSOSAlerts() {
    try {
      const res  = await fetch(`${API_URL}/admin/sos`, { headers: { Authorization: `Bearer ${token}` } });
      renderSOS(await res.json());
    } catch (err) { console.error(err); }
  }

  async function fetchEmergencies() {
    try {
      const res  = await fetch(`${API_URL}/admin/emergency`, { headers: { Authorization: `Bearer ${token}` } });
      renderEmergencies(await res.json());
    } catch (err) { console.error(err); }
  }

  async function fetchReports() {
    try {
      const res  = await fetch(`${API_URL}/admin/reports`, { headers: { Authorization: `Bearer ${token}` } });
      renderReports(await res.json());
    } catch (err) { console.error(err); }
  }

  // ══════════════════════════════════════════════════════════
  //  MAP — REGISTRY-BASED (no full clear/redraw)
  // ══════════════════════════════════════════════════════════

  /**
   * Called every 5 s from polling.
   * Adds/updates markers for current users, removes markers for users
   * who are no longer in the list (went inactive).
   */
  function reconcileMarkers(locations) {
    const incomingIds = new Set();

    locations.forEach(loc => {
      const uid  = String(loc.userId?._id || loc.userId);
      const name = loc.userId?.name || 'Unknown User';
      incomingIds.add(uid);

      // Normalise into cache
      locationCache.set(uid, {
        userId:    { _id: uid, name },
        latitude:  loc.latitude,
        longitude: loc.longitude,
        type:      loc.type,
        updatedAt: loc.updatedAt
      });

      upsertMarker(uid);
    });

    // Remove markers for users no longer in the list
    markerRegistry.forEach((_, uid) => {
      if (!incomingIds.has(uid)) {
        adminMap.removeLayer(markerRegistry.get(uid).marker);
        markerRegistry.delete(uid);
        locationCache.delete(uid);
      }
    });

    fitBounds();
  }

  /**
   * Called immediately from socket events — zero API round-trip.
   * data = { userId, name, latitude, longitude, type, updatedAt }
   */
  function patchMarkerFromSocket(data) {
    const uid = String(data.userId);

    locationCache.set(uid, {
      userId:    { _id: uid, name: data.name || 'Unknown User' },
      latitude:  data.latitude,
      longitude: data.longitude,
      type:      data.type || 'live',
      updatedAt: data.updatedAt || new Date().toISOString()
    });

    upsertMarker(uid);
    fitBounds();
    updateLiveStats();
  }

  /** Render any cached entries to the map (used when map initialises late) */
  function syncCacheToMap() {
    locationCache.forEach((_, uid) => upsertMarker(uid));
    fitBounds();
  }

  /**
   * Create or update a single marker from locationCache.
   */
  function upsertMarker(uid) {
    if (!adminMap || typeof L === 'undefined') return;

    const loc   = locationCache.get(uid);
    if (!loc) return;

    const isSOS    = loc.type === 'sos';
    const userName = loc.userId?.name || 'Unknown User';
    const pos      = [loc.latitude, loc.longitude];
    
    // Leaflet custom icons
    const iconUrl = isSOS 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
      
    const customIcon = L.icon({
      iconUrl: iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const infoHTML = buildInfoContent(loc);

    if (markerRegistry.has(uid)) {
      // ── Update existing marker in place ──
      const { marker } = markerRegistry.get(uid);
      marker.setLatLng(pos);
      marker.setIcon(customIcon);
      if (isSOS) marker.setZIndexOffset(1000);
      else marker.setZIndexOffset(0);
      marker.getPopup().setContent(infoHTML);
    } else {
      // ── Create new marker ──
      const marker = L.marker(pos, {
        icon: customIcon,
        title: `${isSOS ? '🚨 SOS' : '📍'} ${userName}`,
        zIndexOffset: isSOS ? 1000 : 0
      }).addTo(adminMap);
      
      marker.bindPopup(infoHTML);

      markerRegistry.set(uid, { marker });
    }
  }

  function buildInfoContent(loc) {
    const isSOS    = loc.type === 'sos';
    const userName = loc.userId?.name || 'Unknown User';
    const lastSeen = loc.updatedAt ? new Date(loc.updatedAt).toLocaleTimeString() : '—';
    const accentColor = isSOS ? '#f87171' : '#60a5fa';
    const borderColor = isSOS ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.35)';

    return `
      <div style="background:#1a2035;color:#e0e8ff;padding:12px 14px;
                  border-radius:10px;min-width:180px;font-size:13px;
                  border:1px solid ${borderColor};">
        <div style="font-weight:700;color:${accentColor};margin-bottom:6px;">
          ${isSOS ? '🚨 SOS ALERT' : '📍 Active User'}
        </div>
        <div><b>Name:</b> ${userName}</div>
        <div><b>Lat:</b> ${(loc.latitude  || 0).toFixed(6)}</div>
        <div><b>Lng:</b> ${(loc.longitude || 0).toFixed(6)}</div>
        <div style="margin-top:5px;color:#8a9bc4;font-size:11px;">
          ⏱ Last seen: ${lastSeen}
        </div>
      </div>`;
  }

  function fitBounds() {
    if (!adminMap || markerRegistry.size === 0) return;
    const markersArray = Array.from(markerRegistry.values()).map(m => m.marker);
    const group = new L.featureGroup(markersArray);
    adminMap.fitBounds(group.getBounds(), { padding: [30, 30] });
  }

  function updateLiveStats() {
    const all      = Array.from(locationCache.values());
    const sosCount = all.filter(l => l.type === 'sos').length;
    const livCount = all.filter(l => l.type === 'live').length;
    const total    = all.length;

    const countEl = document.getElementById('live-user-count');
    const timeEl  = document.getElementById('last-updated-time');

    if (countEl) {
      countEl.innerHTML = total === 0
        ? '<i class="fa-solid fa-circle-dot" style="color:#8a9bc4;"></i> No active users'
        : `<i class="fa-solid fa-users" style="color:#10b981;"></i> ${total} user${total !== 1 ? 's' : ''}` +
          (sosCount > 0 ? ` &nbsp;·&nbsp; <span style="color:#f87171;">⚠ ${sosCount} SOS</span>` : '') +
          (livCount > 0 ? ` &nbsp;·&nbsp; <span style="color:#60a5fa;">${livCount} tracked</span>` : '');
    }
    if (timeEl) {
      timeEl.innerHTML = `<i class="fa-regular fa-clock"></i> Updated ${new Date().toLocaleTimeString()}`;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  TABLE RENDERERS
  // ══════════════════════════════════════════════════════════

  function renderSOS(alerts) {
    const tbody = document.getElementById('sos-table-body');
    tbody.innerHTML = '';
    if (!alerts?.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No active SOS alerts.</td></tr>';
      return;
    }
    alerts.forEach(alert => {
      const tr = document.createElement('tr');
      const badge = alert.status === 'active'
        ? '<span class="badge badge-danger">Active</span>'
        : '<span class="badge badge-success">Resolved</span>';
      tr.innerHTML = `
        <td>${new Date(alert.createdAt).toLocaleString()}</td>
        <td>${alert.userId?.name ?? 'Unknown'}</td>
        <td style="font-family:monospace;font-size:0.82rem;">
          ${alert.latitude?.toFixed(5) ?? '—'}, ${alert.longitude?.toFixed(5) ?? '—'}
        </td>
        <td>${badge}</td>
        <td><button class="btn-sm btn-outline" onclick='openModal("sos", ${JSON.stringify(alert)})'>View Details</button></td>`;
      tbody.appendChild(tr);
    });
  }

  function renderEmergencies(emergencies) {
    const tbody = document.getElementById('emergency-table-body');
    tbody.innerHTML = '';
    if (!emergencies?.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No emergency requests.</td></tr>';
      return;
    }
    emergencies.forEach(req => {
      const typeBadge =
        req.type === 'medical'  ? '<span class="badge badge-info">Medical</span>' :
        req.type === 'security' ? '<span class="badge badge-warning">Security</span>' :
                                  '<span class="badge badge-success">Other</span>';
      const statusBadge =
        req.status === 'pending'  ? '<span class="badge badge-danger">Pending</span>' :
        req.status === 'assigned' ? '<span class="badge badge-warning">Assigned</span>' :
                                    '<span class="badge badge-success">Resolved</span>';
      const action = req.status !== 'resolved'
        ? `<button class="btn-sm btn-resolve" onclick="resolveEmergency('${req._id}')">Resolve</button>`
        : '<span style="color:var(--text-muted);font-size:0.8rem;">Resolved</span>';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(req.createdAt).toLocaleString()}</td>
        <td>${req.userId?.name ?? 'Unknown'}</td>
        <td>${typeBadge}</td>
        <td>${req.description}</td>
        <td>${statusBadge}</td>
        <td><button class="btn-sm btn-outline" onclick='openModal("emergency", ${JSON.stringify(req)})'>View Details</button></td>`;
      tbody.appendChild(tr);
    });
  }

  function renderReports(reports) {
    const tbody = document.getElementById('report-table-body');
    tbody.innerHTML = '';
    if (!reports?.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No incident reports.</td></tr>';
      return;
    }
    reports.forEach(rep => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(rep.createdAt).toLocaleString()}</td>
        <td>${rep.userId?.name ?? 'Unknown'}</td>
        <td><strong>${rep.title}</strong></td>
        <td>${rep.location}</td>
        <td>${rep.description}</td>
        <td><button class="btn-sm btn-outline" onclick='openModal("report", ${JSON.stringify(rep)})'>View Details</button></td>`;
      tbody.appendChild(tr);
    });
  }

  // ══════════════════════════════════════════════════════════
  //  ACTIONS  (inline onClick handlers)
  // ══════════════════════════════════════════════════════════

  window.resolveEmergency = async (id) => {
    if (!confirm('Mark this emergency as resolved?')) return;
    const res = await fetch(`${API_URL}/admin/emergency/${id}/resolve`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchEmergencies();
      closeModal();
    } else alert('Failed to resolve emergency.');
  };

  window.deleteReport = async (id) => {
    if (!confirm('Permanently delete this report?')) return;
    const res = await fetch(`${API_URL}/admin/report/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchReports();
      closeModal();
    } else alert('Failed to delete report.');
  };

  // ══════════════════════════════════════════════════════════
  //  MODAL LOGIC
  // ══════════════════════════════════════════════════════════
  window.openModal = (type, data) => {
    const modal = document.getElementById('details-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions');
    
    let html = '';
    let actionHtml = '';

    const date = new Date(data.createdAt).toLocaleString();
    const userName = data.userId?.name || 'Unknown User';
    const userEmail = data.userId?.email || 'N/A';

    html += `<p><strong>User:</strong> ${userName} (${userEmail})</p>`;
    html += `<p><strong>Time:</strong> ${date}</p>`;

    if (type === 'sos') {
      title.innerHTML = '<i class="fa-solid fa-bell" style="color:var(--error-color)"></i> SOS Alert Details';
      html += `<p><strong>Location:</strong> ${data.latitude}, ${data.longitude}</p>`;
      html += `<p><strong>Status:</strong> ${data.status}</p>`;
    } else if (type === 'emergency') {
      title.innerHTML = '<i class="fa-solid fa-truck-medical" style="color:#38bdf8"></i> Emergency Details';
      html += `<p><strong>Type:</strong> <span style="text-transform: capitalize;">${data.type}</span></p>`;
      html += `<p><strong>Description:</strong> ${data.description}</p>`;
      html += `<p><strong>Status:</strong> <span style="text-transform: capitalize;">${data.status}</span></p>`;
      
      if (data.status !== 'resolved') {
        actionHtml = `<button class="btn-primary" onclick="resolveEmergency('${data._id}')" style="background:#10b981;">Mark as Resolved</button>`;
      }
    } else if (type === 'report') {
      title.innerHTML = '<i class="fa-solid fa-bullhorn" style="color:#f59e0b"></i> Incident Report Details';
      html += `<p><strong>Title:</strong> ${data.title}</p>`;
      html += `<p><strong>Location:</strong> ${data.location}</p>`;
      html += `<p><strong>Description:</strong> ${data.description}</p>`;
      html += `<p><strong>Status:</strong> ${data.status}</p>`;
      
      actionHtml = `<button class="btn-primary" onclick="deleteReport('${data._id}')" style="background:#ef4444;">Delete Report</button>`;
    }

    body.innerHTML = html;
    actions.innerHTML = actionHtml;
    modal.classList.add('active');
  };

  window.closeModal = () => {
    document.getElementById('details-modal').classList.remove('active');
  };

  // Cleanup on navigate away
  window.addEventListener('beforeunload', () => {
    if (liveTrackTimer) clearInterval(liveTrackTimer);
  });
});
