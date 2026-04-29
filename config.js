@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #6366f1; /* Indigo */
  --primary-hover: #4f46e5;
  --secondary-color: #ec4899; /* Pink */
  --bg-dark: #0f172a; /* Slate 900 */
  --bg-card: rgba(30, 41, 59, 0.7); /* Slate 800 with opacity */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: rgba(255, 255, 255, 0.1);
  --error-color: #ef4444;
  --success-color: #22c55e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body {
  background-color: var(--bg-dark);
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}

/* Glassmorphism Card Container */
.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

/* Glowing orb effect behind card */
.auth-container::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  width: 100px;
  height: 100px;
  background: var(--primary-color);
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.5;
  z-index: -1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.form-control {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-control::placeholder {
  color: rgba(148, 163, 184, 0.5);
}

/* Select specifically */
select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/200.0/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}
select.form-control option {
  background: var(--bg-dark);
  color: var(--text-main);
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px var(--primary-color);
}

.btn-primary:active {
  transform: translateY(0);
}

.auth-toggle {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.auth-toggle a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-toggle a:hover {
  color: var(--secondary-color);
}

/* Error/Success Messages */
.message {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
  display: none;
  animation: fadeIn 0.3s ease;
}

.message.error {
  display: block;
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.message.success {
  display: block;
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* Form Switching Animation */
#register-form {
  display: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-enter {
  animation: fadeIn 0.4s ease forwards;
}

/* =========================================
   DASHBOARD & NAVBAR STYLES
   ========================================= */

.dashboard-body {
  display: block; /* Override default flex */
  align-items: stretch;
  background-color: var(--bg-dark);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.05);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

#nav-username {
  font-weight: 600;
  color: var(--text-main);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border-color: var(--error-color);
}

.hidden-role {
  display: none !important;
}

/* Dashboard Main */
.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-banner {
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.welcome-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  color: transparent;
}

.welcome-banner p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.danger-card:hover { box-shadow: 0 10px 20px -10px rgba(239, 68, 68, 0.5); border-color: rgba(239, 68, 68, 0.5); }
.warning-card:hover { box-shadow: 0 10px 20px -10px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.5); }
.info-card:hover { box-shadow: 0 10px 20px -10px rgba(56, 189, 248, 0.5); border-color: rgba(56, 189, 248, 0.5); }

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.danger-card .action-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.warning-card .action-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.info-card .action-icon { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

.action-content h2 {
  color: var(--text-main);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.action-content p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* =========================================
   SOS ALERT STYLES
   ========================================= */

.sos-main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.sos-container {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.2);
}

.sos-header h1 {
  color: var(--error-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.sos-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.sos-action-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
}

.btn-sos {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, #ef4444 0%, #b91c1c 100%);
  border: 8px solid rgba(239, 68, 68, 0.3);
  color: white;
  font-size: 2rem;
  font-weight: 800;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
  transition: transform 0.1s;
}

.btn-sos:active {
  transform: scale(0.95);
}

.btn-sos.sending {
  background: radial-gradient(circle, #f59e0b 0%, #d97706 100%);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.6);
}

.sos-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid #ef4444;
  z-index: 1;
  animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
}

.location-status {
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* =========================================
   ADMIN PANEL STYLES
   ========================================= */

.admin-main {
  max-width: 1400px;
}

.admin-section {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: var(--text-muted);
}

.admin-table th {
  font-weight: 600;
  color: var(--text-main);
  background: rgba(0,0,0,0.2);
}

.admin-table tbody tr:hover {
  background: rgba(255,255,255,0.02);
}

.admin-table td {
  font-size: 0.9rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-danger { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.badge-warning { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.badge-success { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.badge-info { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-resolve {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.btn-resolve:hover {
  background: #22c55e;
  color: white;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.text-center {
  text-align: center;
}
