import type { Component } from "svelte";
import type { Readable, Writable } from "svelte/store";
import { rankRoute } from "./utils";
import { getContext } from "svelte";
import { derived, writable } from "svelte/store";
import { NSP_PARAM, NSP_ROUTER } from "./namespace";

export type AnyObject = { [ P in number | string | symbol ]: any };

export type BrowserRouter = {
    path: string;
    element: Component<any>;
};

export type Router = {
    routes: BrowserRouter[];
    currentTarget: Readable<string>;
    navigate: ( to: string, options?: { state?: AnyObject, replace?: boolean } ) => void;
    location: {
        state: Writable<AnyObject>;
        pathname: Writable<string>;
        search: Writable<string>;
        hash: Writable<string>;
    };
    cleanup: () => void
};

export function createBrowserRouter( routes: BrowserRouter[] ): Router {
    routes.sort( ( a, b ) => rankRoute( b.path ) - rankRoute( a.path ) );
    const pathname = writable( window.location.pathname );
    const search = writable( window.location.search );
    const state = writable( window.history.state );
    const hash = writable( window.location.hash );
    const currentTarget = derived( [ pathname, search, hash ], ( [ $p, $s, $h ]) => $p + $s + $h );
    function navigate( to: string, options: { state?: AnyObject, replace?: boolean } = {} ) {
        const url = new URL(to, window.location.origin);
        const target = url.pathname + url.search + url.hash;
        if (target === window.location.pathname + window.location.search + window.location.hash) return;
        const method = options.replace ? 'replaceState' : 'pushState';
        history[method](null, '', target);
        pathname.set(url.pathname);
        search.set(url.search);
        hash.set(url.hash);
    }
    const handlePop = () => {
        pathname.set( window.location.pathname );
        search.set( window.location.search );
        state.set( window.history.state );
        hash.set( window.location.hash );
    };
    window.addEventListener( 'popstate', handlePop );
    return {
        routes, currentTarget, navigate, location: { pathname, search, state, hash },
        cleanup: () => window.removeEventListener( 'popstate', handlePop ),
    };
}

export function useParams< T extends Record< string, string > >() {
    return getContext< T >( NSP_PARAM );
}

export function useNavigate() {
    const { navigate, location } = getContext< Router >( NSP_ROUTER );
    return { navigate, location }
}

interface LinkOptions {
  replace?: boolean;
  disabled?: boolean;
  external?: boolean;
  state?: AnyObject;
}

export function link( node: HTMLAnchorElement, options: LinkOptions = {} ) {
    const router = getContext<Router>( NSP_ROUTER );
    if (!router) {
        return;
    }
    function onClick(event: MouseEvent) {
        if ( options.disabled ) {
            event.preventDefault();
            return;
        }
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }
        const href = node.getAttribute("href");
        if ( !href ) return;
        if (
            options.external ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("//")
        ) {
            return;
        }
        if ( href.startsWith("#") ) {
            event.preventDefault();
            const id = href.slice(1);
            const el = id ? document.getElementById(id) : null;
            el?.scrollIntoView({ behavior: "smooth" });
            history.replaceState(history.state, "", href);
            return;
        }
        event.preventDefault();
        router.navigate( href, { replace: options.replace, state: options.state } );
    }
    node.addEventListener( "click", onClick );
    return {
        update( newOptions: LinkOptions ) {
            options = newOptions;
        },
        destroy() {
            node.removeEventListener("click", onClick);
        }
    };
}