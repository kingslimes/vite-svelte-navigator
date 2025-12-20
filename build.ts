import { $, build } from "bun";
import dts from "bun-plugin-dts";

// CLEAN DIST
await $`rm -rf ./dist`;

// BUILD MAIN
await build({
    minify: true,
    format: "esm",
    outdir: "dist",
    splitting: false,
    target: "browser",
    sourcemap: "none",
    naming: "main.js",
    external: ['svelte','*.svelte'],
    entrypoints: ["./src/index.ts"],
    plugins: [
        dts({ compilationOptions: { preferredConfigPath: './tsconfig.dts.json' }, output: { noBanner: true } })
    ]
});
await $`mv ./dist/index.d.ts ./dist/main.d.ts`;

// BUILD INDEX
const files = [
    { name: 'index.js', content: "export{default as Link}from'./Link.svelte'\nexport{default as RouterProvider}from'./Provider.svelte'\nexport{createBrowserRouter,useNavigate,useParams,link}from'./main'" },
    { name: 'index.d.ts', content: "export{type BrowserRouter}from'./main'\nexport{default as Link}from'./Link.svelte'\nexport{default as RouterProvider}from'./Provider.svelte'\nexport{createBrowserRouter,useNavigate,useParams,link}from'./main'" }
]
for ( const file of files ) {
    await Bun.write(
        Bun.file(`./dist/${ file.name }`),
        file.content
    );
}

// BUILD SVELTE
await $`rsync -av --include='*/' --include='*.svelte' --exclude='*' src/ dist/`;
await $`sed -i 's|'./navigator'|'./main'|g' dist/*.svelte`;
await $`sed -i 's|'./namespace'|'./main'|g' dist/*.svelte`;
await $`sed -i 's|'./utils'|'./main'|g' dist/*.svelte`;
