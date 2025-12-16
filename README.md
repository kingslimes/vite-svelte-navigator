# vite-svelte-navigator

**A simple and powerful SPA navigator/router for Svelte.**

`vite-svelte-navigator` is a straightforward library designed to provide client-side routing for Single Page Applications (SPA) built with Svelte. It leverages the HTML5 History API for clean URLs and offers a Svelte-friendly way to manage application navigation and display components based on the current URL.

## ✨ Features

* **Browser History API:** Utilizes `history.pushState` and `popstate` events for smooth, native-like navigation.
* **Component-Based Routing:** Define routes with Svelte components.
* **Parameter Handling:** Easy access to dynamic route parameters via `useParams`.
* **Route Ranking:** Automatically sorts routes using `rankRoute` to ensure the most specific match is found first.
* **Built-in 404:** Includes a default `NotFound` component for unmatched routes.
* **Simple API:** Provides hook-like functions for navigation (`useNavigate`) and parameter access (`useParams`).

## 📦 Installation

using `npm`
```bash
npm install vite-svelte-navigator
```
using `bun`
```bash
bun add vite-svelte-navigator
```

This package targets Svelte version `^5.46.0` as a peer dependency.

## 🚀 Usage

### Setup the Router

First, define your routes (`BrowserRouter[]`) and create the router instance using `createBrowserRouter`.

The routes are sorted to prioritize specificity based on the `rankRoute` utility.

**`App.svelte` (or wherever your app initializes):**
```svelte
<script lang="ts">
    import { createBrowserRouter } from 'vite-svelte-navigator';
    import CustomNotFoundPage from './pages/CustomNotFoundPage.svelte'; // Example custom component

    // Import your components (Home, About, UserProfile, etc.)
    import Home from './pages/Home.svelte';
    import About from './pages/About.svelte';
    import UserProfile from './pages/UserProfile.svelte';
    
    const router = createBrowserRouter([
        { path: '/', element: Home },
        { path: '/about', element: About },
        { path: '/user/:id', element: UserProfile }, // Dynamic route segment
        // A catch-all route for custom 404 page
        { path: '*', element: CustomNotFoundPage }, 
    ]);
</script>
<RouterProvider {router} />
```

### Navigation and Parameters

#### `Link` Component

Use the `Link` component for declarative, client-side navigation. When clicked, it prevents the default action and calls `router.navigate`.

```svelte
<script>
    import { Link } from 'vite-svelte-navigator';
</script>

<nav>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/user/123">User 123</Link>
    <Link href="/new-path" replace>Navigate (Replace)</Link>
    <Link href="https://example.com" external>External Site</Link>
</nav>
```

#### `useNavigate` Hook

`useNavigate` retrieves the `Maps` function and `location` stores from the router context (`NSP_ROUTER`).

```svelte
<script>
    import { useNavigate } from 'vite-svelte-navigator';
    
    const { navigate, location } = useNavigate();

    // Programmatic navigation
    function goToHome() {
        navigate('/');
    }

    // Access to current path/state
    location.pathname.subscribe(p => console.log('Current Path:', p)); 
</script>

<button on:click={goToHome}>Go to Home Programmatically</button>
```

#### `useParams` Hook

`useParams` retrieves the matched route parameters from the context (`NSP_PARAM`).

**`UserProfile.svelte`:**

```svelte
<script lang="ts">
    import { useParams } from 'vite-svelte-navigator';
    
    // The type T is inferred from the usage context, e.g., { id: string } for path /user/:id
    const params = useParams<{ id: string }>();

    // The params store is writable but typically only updated by the RouterProvider
    $: userId = $params.id; 
</script>

<h2>User Profile for ID: {userId}</h2>
```

#### `link` Action

The `link` action can be used directly on any `<a>` tag to enable Svelte navigator functionality.

```svelte
<script>
    import { link } from 'vite-svelte-navigator';
</script>

<a href="/dashboard" use:link={{ replace: true }}>Go to Dashboard</a>
```

## ⚙️ Core Concepts (Route Matching)

The routing is fundamentally based on two main utility functions:

1.  **`rankRoute(route: string)`:** Calculates a score for a given route path.
    * Routes are segmented (e.g., `/user/:id` -> `['user', ':id']`).
    * Segments are scored (e.g., static segments get more points than dynamic ones).
    * This ensures more specific routes (higher score) are checked and matched before generic ones. The routes are sorted in `createBrowserRouter` based on this rank.

2.  **`matchRoute(pattern: string, pathname: string)`:** Attempts to match the current URL (`pathname`) against a route `pattern`.
    * It iterates through segments of both the pattern and the path.
    * If a segment is dynamic (starts with `:`), it captures the value into the `params` object.
    * If a segment is a splat (`*`), it captures the remaining path into `params['*']` and returns immediately.
    * If a static segment doesn't match, it returns `null`.


| Pattern Segment | Description | Example Match | Score Value |
| :--- | :--- | :--- | :--- |
| **Static** | Exact text match. | `/about` matches only `/about` | `STATIC_POINTS` (3) + `SEGMENT_POINTS` (4) |
| **Dynamic** | Starts with `:` (e.g., `:id`). Captures the path segment as a parameter. | `/user/:id` matches `/user/123` (captures `id: '123'`) | `DYNAMIC_POINTS` (2) + `SEGMENT_POINTS` (4) |
| **Splat** | The wildcard `*`. Matches any remaining part of the path and captures it into the `*` parameter. | `/files/*` matches `/files/images/cat.jpg` | Low/Negative score (`SPLAT_PENALTY`) to ensure it's checked last |

## 📜 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.
