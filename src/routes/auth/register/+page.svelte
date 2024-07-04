<script lang="ts">
    let username = '';
    let password = '';
    let role = '';
  
    async function register() {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      if (response.ok) {
        window.location.href = '/auth/login';
      } else {
        alert('Registration failed');
      }
    }
  </script>
  
  <form on:submit|preventDefault={register}>
    <input type="text" bind:value={username} placeholder="Username">
    <input type="password" bind:value={password} placeholder="Password">
    <select bind:value={role}>
      <option value="" disabled selected>Select Role</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
    <button type="submit">Register</button>
  </form>
  