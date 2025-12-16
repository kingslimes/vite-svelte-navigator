<script lang='ts'>
    import L from './Link.svelte'
</script>
<section style="top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:absolute;min-height:10rem;background:white">
    <figure style="gap:1em;display:flex;align-items:center">
        <figcaption style="font-size:2.4rem;font-weight:700;">404</figcaption>
        <span style="width:1.2px;height:3.2rem;display:block;background:black"></span>
        <article style="font-size:13pt">This page could not be found.</article>
    </figure>
    <L href="/" style="position:fixed;top:1rem;left:1rem;text-decoration:none;color:black">← HOME</L>
</section>