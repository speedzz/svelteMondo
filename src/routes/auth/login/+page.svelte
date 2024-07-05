<script lang="ts">
  let username = "";
  let password = "";

  async function login() {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      window.location.href = "/";
    } else {
      alert("Login failed");
    }
  }
</script>

<div class="container d-flex justify-content-center align-items-center vh-100 flex-column">
  <div class="card col-md-3">
    <div class="card-header">
      <h5 class="card-title">Login</h5>
    </div>
    <div class="card-body">
      <form on:submit|preventDefault={login}>
        <div class="mb-3">
          <input type="text" class="form-control" bind:value={username} placeholder="Username" />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control" bind:value={password} placeholder="Password" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
  <div class="card-footer text-center col-md-3">
    <a href="/auth/register" class="btn btn-success decoration-none mt-3 w-100"> Register </a>
  </div>
</div>
