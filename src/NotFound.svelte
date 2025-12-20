<script lang='ts'>
    import L from './Link.svelte'
</script>
<section style="top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:absolute;min-height:10rem;background:white">
    <figure style="gap:1em;display:flex;align-items:center">
        <figcaption style="font-size:2.4rem;font-weight:700;">404</figcaption>
        <span style="width:1.2px;height:3.2rem;display:block;background:black"></span>
        <article style="font-size:13pt">This page could not be found.</article>
    </figure>
    <L href="/" style="display:flex;gap:5px;position:fixed;top:1rem;left:1rem;text-decoration:none;color:black">
        <svg style="width:20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>HOME</span>
    </L>
</section>