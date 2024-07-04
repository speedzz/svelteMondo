<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  async function logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    if (response.ok) {
      await goto('/auth/login');
    } else {
      alert('Logout failed');
    }
  }
</script>

<h1>Protected Content</h1>
<p>Only authenticated admin users can see this. { data.user.username }  </p>
<button on:click={logout}>Logout</button>
