import { $, build } from "bun";
import dts from "bun-plugin-dts";

// CLEAN DIST
await $`rm -rf ./dist`;

// BUILD
await build({
    format: "esm",
    outdir: "dist",
    splitting: true,
    target: "browser",
    sourcemap: "none",
    naming: "[name].js",
    external: ['svelte','*.svelte'],
    entrypoints: ["./src/index.ts"],
    plugins: [
        dts({ compilationOptions: { preferredConfigPath: './tsconfig.dts.json' }, output: { noBanner: true } })
    ]
});
await $`rm -f ./dist/index.js`;
for ( const file of [ "index", "utils", "navigator", "namespace" ] ) {
    await $`bun build src/${file}.ts --outfile dist/${file}.js --format esm --target browser --minify --no-bundle`;
}
await $`rsync -av --include='*/' --include='*.svelte' --exclude='*' src/ dist/`;
await $`sed -i 's|'./navigator'|'./index'|g' dist/*.svelte`;

// UPDATE VERSION
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
function incrementVersion( version: string ): string {
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
const registry = await fetch('https://registry.npmjs.org/vite-svelte-navigator');
const raw = await registry.json() as { 'dist-tags': { latest: string } };
const pkg = Bun.file('./package.json');
const pack = await pkg.json() as PackageJson;
pack.version = incrementVersion( raw['dist-tags'].latest );
await Bun.write( "./package.json", JSON.stringify( pack, null, 2 ) + "\n" );
