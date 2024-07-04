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























<button class="btn btn-danger" on:click={logout}>Logout</button>
