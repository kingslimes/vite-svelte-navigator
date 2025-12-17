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
