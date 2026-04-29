<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emergency Request - Campus SafeHer</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
      <a href="route.html"><i class="fa-solid fa-map-location-dot"></i> Safe Route</a>
      <a href="emergency.html" class="active"><i class="fa-solid fa-truck-medical"></i> Emergency</a>
      <a href="report.html"><i class="fa-solid fa-file-signature"></i> Report</a>
      <a href="admin.html" id="nav-admin" class="hidden-role"><i class="fa-solid fa-user-shield"></i> Admin Panel</a>
    </div>
    <div class="nav-user">
      <button id="logout-btn" class="btn-outline"><i class="fa-solid fa-right-from-bracket"></i></button>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="dashboard-main">
    <div class="auth-container" style="max-width: 600px; margin: 2rem auto;">
      <div class="auth-header">
        <h1><i class="fa-solid fa-truck-medical"></i> Request Emergency</h1>
        <p>Submit a request for immediate medical or security assistance.</p>
      </div>

      <div id="message-container" class="message"></div>

      <form id="emergency-form" class="animate-enter">
        <div class="form-group">
          <label for="emergency-type">Emergency Type</label>
          <select id="emergency-type" class="form-control" required>
            <option value="" disabled selected>Select the type of emergency</option>
            <option value="medical">Medical Emergency (Ambulance/First Aid)</option>
            <option value="security">Security Emergency (Campus Police/Guards)</option>
            <option value="other">Other Immediate Assistance</option>
          </select>
        </div>

        <div class="form-group">
          <label for="emergency-description">Description & Exact Location</label>
          <textarea id="emergency-description" class="form-control" rows="5" placeholder="Please describe the situation briefly and provide your exact location on campus (e.g., Library 2nd Floor, Near North Gate)." required></textarea>
        </div>

        <button type="submit" class="btn-primary" id="submit-btn" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9);">
          Submit Request
        </button>
      </form>
    </div>
  </main>

  <script src="js/config.js"></script>
  <script src="js/emergency.js"></script>
</body>
</html>
