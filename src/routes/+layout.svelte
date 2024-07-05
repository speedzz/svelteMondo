<script lang="ts">
    import 'bootstrap/dist/css/bootstrap.min.css';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let { children } = $props();
    //import 'bootstrap/dist/css/bootstrap.min.css';

    if (browser) {
        import('bootstrap/dist/js/bootstrap.bundle.min.js').then((module) => {
            window.bootstrap = module;
        });
    }
</script>

{@render children()}