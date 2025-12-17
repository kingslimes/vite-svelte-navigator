import { $ } from "bun";

// BUMP VERSION
type PackageJson = {
    name: "vite-svelte-navigator",
    version: string,
    description: string,
    author: {
        name: string,
        email: string,
        url: string
    },
    files: string[],
    exports: {
        [ key: string ]: Record<string,string>
    },
    license: string,
    keywords: string[],
    repository: {
        type: string,
        url: string
    },
    bugs: {
        url: string
    },
    homepage: string,
    sideEffects: boolean,
    private: boolean,
    devDependencies: Record<string,string>,
    peerDependencies: Record<string,string>
}
function bumpVersion( version: string ): string {
    const parts = version.split('.').map(Number);
    for ( let i = parts.length - 1; i >= 0; i-- ) {
        parts[i]++;
        if ( parts[i] <= 9 ) break;
        parts[i] = 0;
        if ( i === 0 ) {
            parts.unshift(1);
            break;
        }
    }
    return parts.join('.');
}
const registry = await fetch('https://registry.npmjs.org/vite-svelte-navigator/latest');
const { version } = await registry.json() as { version: string };
const pkg = await Bun.file('./package.json').json() as PackageJson;
const latestVersion = bumpVersion( version );
if ( latestVersion !== pkg.version ) {
    pkg.version = latestVersion;
    await Bun.write( "./package.json", JSON.stringify( pkg, null, 2 ) + "\n" );
    console.log( `Updated to version ${latestVersion}` )
    await $`
      git config user.name "github-actions[bot]"
      git config user.email "github-actions[bot]@users.noreply.github.com"
      git add package.json
      git diff --cached --quiet || git commit -m "update version ${latestVersion}"
      git push origin main
    `;
} else {
    console.log( `Already version ${pkg.version}` )
}
