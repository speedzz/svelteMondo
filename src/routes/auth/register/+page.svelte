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
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card" style="width: 18rem;">
      <div class="card-header">
        <h5 class="card-title">Register</h5>
      </div>
      <div class="card-body">
        <form on:submit|preventDefault={register}>
          <div class="mb-3">
            <input type="text" class="form-control" bind:value={username} placeholder="Username" />
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" bind:value={password} placeholder="Password" />
          </div>
          <div class="mb-3">
            <select class="form-select" bind:value={role}>
              <option value="" disabled selected>Select Role</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
      </div>
     
    </div>
  </div>
