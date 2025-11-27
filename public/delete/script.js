const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const deleteBtn = document.getElementById('deleteBtn');

let authToken = null; // Store the token received from login API

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    // Replace YOUR_LOGIN_API_URL with the actual login API URL
    const response = await fetch('/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      authToken = data.data;
      loginForm.style.display = 'none';
      deleteBtn.style.display = 'block';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Error during login. Please try again later.');
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!authToken) {
    alert('Please login first to delete your account.');
    return;
  }

  const username = loginForm.username.value;

  try {
    // Replace YOUR_DELETE_API_URL with the actual delete API URL
    const response = await fetch(`/api/v1/users/${username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`, // Sending the token as a Bearer token
      },
    });

    console.log(response);
    if (response.ok) {
      alert('Account deleted successfully.');
      loginBtn.style.display = 'block';
      deleteBtn.style.display = 'none';
      loginForm.reset();
      authToken = null; // Clear the token after successful deletion
    } else {
      alert('Failed to delete account. Please try again.');
    }
  } catch (error) {
    console.error('Error during account deletion:', error);
    alert('Error during account deletion. Please try again later.');
  }
});
