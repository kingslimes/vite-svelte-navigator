<script lang='ts'>
	import { matchRoute as m } from './utils'
	import { setContext as c, onDestroy as d } from 'svelte'
	import { NSP_PARAM as p, NSP_ROUTER as r } from './namespace'
	import n from './NotFound.svelte'
	import type { Component as z } from 'svelte'
	import type { Router as o } from './navigator'
	export let router: o
  	c( r, router )
	let g = ''
	router.website.pathname.subscribe( (v) => ( g = v ) )
  	let h: { component: z<any>; params: Record<string, string> } | null = null
	$: {
		h = null
		for ( const r of router.routes ) {
			const a = m( r.path, g )
			if ( a !== null ) {
				h = { component: r.element, params: a }
				c( p, a )
				break
			}
		}
		if ( !h ) {
			const f = router.routes.find((r) => r.path === "*")
			if ( f ) {
				h = { component: f.element, params: {} }
			} else {
				h = { component: n, params: {} }
			}
			c( p, {} )
		}
	}
  	d( router.cleanup )
</script>
{#if h}
  	<svelte:component this={ h.component } params={ h.params } />
{/if}
