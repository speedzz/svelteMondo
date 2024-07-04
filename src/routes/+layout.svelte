<script lang="ts">
    import 'bootstrap/dist/css/bootstrap.min.css';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount(() => {
        if (browser) {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
                .then((bootstrap) => {
                    // Bootstrap JS is now loaded and can be used
                    // You can initialize specific components here if needed
                });
        }
    });
</script>

{@render children()}