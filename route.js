document.addEventListener('DOMContentLoaded', () => {
  const adminLoginForm = document.getElementById('admin-login-form');
  const messageContainer = document.getElementById('message-container');

  const showMessage = (msg, type) => {
    messageContainer.textContent = msg;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';
  };

  const hideMessage = () => {
    messageContainer.className = 'message';
    messageContainer.style.display = 'none';
  };

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Authenticating...';
      hideMessage();
      
      const response = await fetch(`${API_URL}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Admin Login successful! Redirecting...', 'success');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
      } else {
        showMessage(data.message || 'Invalid admin credentials.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Network error. Is the server running?', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Secure Sign In';
    }
  });
});
