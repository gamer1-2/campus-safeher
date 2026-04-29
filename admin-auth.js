<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Portal - Campus SafeHer</title>
  <meta name="description" content="Admin Portal for Campus SafeHer">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <div class="auth-container">
    <div class="auth-header">
      <h1>Admin Portal</h1>
      <p id="auth-subtitle">Authorized personnel only.</p>
    </div>

    <div id="message-container" class="message"></div>

    <!-- Admin Login Form -->
    <form id="admin-login-form" class="animate-enter">
      <div class="form-group">
        <label for="login-email">Admin Email</label>
        <input type="email" id="login-email" class="form-control" placeholder="admin@campus.edu" required>
      </div>
      <div class="form-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn-primary" id="login-btn">Secure Sign In</button>
      
      <div class="auth-toggle" style="margin-top: 15px;">
        <a href="index.html" class="text-sm" style="color: var(--secondary); opacity: 0.8;">&larr; Back to User Login</a>
      </div>
    </form>

  </div>

  <script src="js/config.js"></script>
  <script src="js/admin-auth.js"></script>
</body>
</html>
