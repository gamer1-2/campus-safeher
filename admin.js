<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Campus SafeHer</title>
  <meta name="description" content="Campus SafeHer security control center — monitor live user locations, SOS alerts, and emergency requests in real time.">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    /* ── Live Tracking Section ─────────────────────────── */
    .live-tracking-section {
      border: 1px solid rgba(16, 185, 129, 0.3);
      background: linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(14,30,55,0.6) 100%);
    }

    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .section-header-row h2 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin: 0;
    }

    /* Pulsing LIVE dot */
    .live-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: livePulse 1.6s ease-in-out infinite;
    }

    @keyframes livePulse {
      0%   { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70%  { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* LIVE pill label */
    .live-label {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #10b981;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.35);
      padding: 2px 8px;
      border-radius: 99px;
      text-transform: uppercase;
    }

    .live-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .live-user-count {
      font-size: 0.82rem;
      font-weight: 600;
      color: #e0e8ff;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      padding: 4px 12px;
      border-radius: 99px;
    }

    .live-updated {
      font-size: 0.78rem;
      color: var(--text-muted, #8a9bc4);
    }

    /* Map container */
    #admin-map {
      width: 100%;
      height: 450px;
      border-radius: 12px;
      border: 1px solid rgba(16,185,129,0.2);
      background: #0e1b2e;
      margin-bottom: 1rem;
    }

    /* Legend */
    .map-legend {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      font-size: 0.8rem;
      color: var(--text-muted, #8a9bc4);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-dot.sos  { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,0.6); }
    .legend-dot.live { background: #3b82f6; box-shadow: 0 0 6px rgba(59,130,246,0.4); }

    /* Empty-state for the map */
    .map-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 450px;
      border-radius: 12px;
      border: 1px dashed rgba(16,185,129,0.2);
      background: rgba(14,27,46,0.6);
      color: var(--text-muted, #8a9bc4);
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .map-empty-state i {
      font-size: 2rem;
      opacity: 0.4;
      margin-bottom: 0.25rem;
    }
    /* Modal Styling */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-content {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      padding: 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 1rem; right: 1rem;
      background: none; border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-close:hover { color: white; }
    .modal-header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 1rem; margin-bottom: 1rem;
    }
    .modal-body p {
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }
    .modal-body p strong { color: var(--text-main); }
    .modal-actions {
      display: flex; gap: 1rem; margin-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1rem;
    }
  </style>
</head>
<body class="dashboard-body">

  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="nav-brand">
      <i class="fa-solid fa-shield-halved"></i> Campus SafeHer
    </div>
    <div class="nav-links">
      <a href="home.html"><i class="fa-solid fa-house"></i> Home</a>
      <a href="sos.html"><i class="fa-solid fa-bell"></i> SOS Alert</a>
      <a href="emergency.html"><i class="fa-solid fa-truck-medical"></i> Emergency</a>
      <a href="report.html"><i class="fa-solid fa-file-signature"></i> Report</a>
      <a href="admin.html" id="nav-admin" class="active"><i class="fa-solid fa-user-shield"></i> Admin Panel</a>
    </div>
    <div class="nav-user">
      <button id="logout-btn" class="btn-outline"><i class="fa-solid fa-right-from-bracket"></i></button>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="dashboard-main admin-main">
    <div class="welcome-banner" style="margin-bottom: 2rem; padding: 1.5rem;">
      <h1>Security Control Center</h1>
      <p>Monitor and manage campus safety alerts in real-time.</p>
    </div>

    <!-- ── Live User Tracking Section ────────────────── -->
    <section class="admin-section live-tracking-section">
      <div class="section-header-row">
        <h2>
          <span class="live-dot"></span>
          <i class="fa-solid fa-location-dot" style="color:#10b981;"></i>
          Live User Tracking
          <span class="live-label">Live</span>
        </h2>
        <div class="live-meta">
          <span class="live-user-count" id="live-user-count">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size:0.75rem;"></i> Loading…
          </span>
          <span class="live-updated" id="last-updated-time">
            <i class="fa-regular fa-clock"></i> —
          </span>
        </div>
      </div>

      <!-- Map (always visible; JS populates it) -->
      <div id="admin-map"></div>

      <!-- Legend -->
      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-dot sos"></span> SOS Alert (bouncing)
        </div>
        <div class="legend-item">
          <span class="legend-dot live"></span> Active Tracked User
        </div>
        <div class="legend-item" style="margin-left:auto; font-style:italic;">
          Updates every 5 seconds
        </div>
      </div>
    </section>

    <!-- ── Active SOS Alerts Section ─────────────────── -->
    <section class="admin-section">
      <div class="section-header">
        <h2><i class="fa-solid fa-bell" style="color: var(--error-color)"></i> Active SOS Alerts</h2>
      </div>
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Location (Lat, Lng)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="sos-table-body">
            <tr><td colspan="4" class="text-center">Loading SOS alerts…</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── Emergency Requests Section ────────────────── -->
    <section class="admin-section">
      <div class="section-header">
        <h2><i class="fa-solid fa-truck-medical" style="color: #38bdf8"></i> Emergency Requests</h2>
      </div>
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="emergency-table-body">
            <tr><td colspan="6" class="text-center">Loading emergencies…</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── Incident Reports Section ───────────────────── -->
    <section class="admin-section">
      <div class="section-header">
        <h2><i class="fa-solid fa-bullhorn" style="color: #f59e0b"></i> Incident Reports</h2>
      </div>
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Title</th>
              <th>Location</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="report-table-body">
            <tr><td colspan="6" class="text-center">Loading reports…</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <!-- Detailed View Modal -->
    <div class="modal-overlay" id="details-modal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <div class="modal-header">
          <h2 id="modal-title"><i class="fa-solid fa-circle-info"></i> Request Details</h2>
        </div>
        <div class="modal-body" id="modal-body">
          <!-- Populated by JS -->
        </div>
        <div class="modal-actions" id="modal-actions">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  </main>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <script src="js/config.js"></script>
  <script src="js/admin.js"></script>
</body>
</html>
