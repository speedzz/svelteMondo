<script lang="ts">
    let username = '';
    let password = '';
  
    async function login() {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        window.location.href = '/protected';
      } else {
        alert('Login failed');
      }
    }
  </script>
  
  <form on:submit|preventDefault={login}>
    <input type="text" bind:value={username} placeholder="Username">
    <input type="password" bind:value={password} placeholder="Password">
    <button type="submit">Login</button>
  </form>
  