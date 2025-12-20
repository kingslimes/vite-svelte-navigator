<script lang='ts'>
	import { getContext as g } from 'svelte'
	import { NSP_ROUTER as b } from './namespace'
	import type { Router as w, AnyObject as m } from './navigator'
	export let href: string
	export let className: string = ''
	export let replace: boolean = false
	export let external: boolean = false
	export let disabled: boolean = false
	export let state: m | undefined = undefined
	export let download: boolean | string = false
	export let rel: string | undefined = undefined
	export let title: string | undefined = undefined
	export let style: string | undefined = undefined
	export let target: string | undefined = undefined
	export let ariaLabel: string | undefined = undefined
	const r = g<w>( b )
    $: e = external || /^https?:\/\//i.test(href) || href.startsWith('//')
    $: h = href.startsWith('#')
    $: d = download !== false
    $: n = !e && !h && !disabled
    $: t = target ?? ( external ? '_blank' : undefined )
    $: f = rel ?? ( t === '_blank' ? 'noopener noreferrer' : undefined )
    $: v = download === true ? true : typeof download === 'string' ? download : undefined
    function c( j: MouseEvent ) {
		if ( disabled ) {
			j.preventDefault()
			return
		}
		if ( j.ctrlKey || j.metaKey || j.shiftKey || j.altKey || j.button === 1 || t || e || d ) { return }
		if ( h ) {
            j.preventDefault()
			const i = href.slice(1)
			const a = i ? document.getElementById(i) : null
			if ( a ) {
				a.scrollIntoView({ behavior: 'smooth' })
			}
			history.replaceState( history.state, '', href )
			return
		}
		if ( n ) {
            if ( r ) {
                j.preventDefault()
                r.navigate( href, { replace, state } )
            } else {
				console.warn('[vite-svelte-navigator] <Link> must be used inside <RouterProvider>')
				return
			}
		}
	}
</script>
<a
	{ href }
	class="{ className }{ disabled ? ' link-disabled' : '' }"
	{ style }
    download={ v }
	target={ t }
	rel={ f }
	aria-label={ ariaLabel }
	aria-disabled={ disabled || undefined }
    role={ disabled ? 'link' : undefined }
    { title }
	on:click|preventDefault={ disabled ? () => false : undefined }
	on:click={ c }>
	<slot />
</a>
<style>
    .link-disabled { opacity: 0.6; pointer-events: none }
</style>
