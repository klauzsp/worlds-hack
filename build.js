import { build } from 'esbuild';
import { cp, mkdir } from 'node:fs/promises';
await build({ entryPoints: ['public/app.js'], bundle: true, format: 'esm', outfile: 'public/bundle.js', external: ['./wasm/reactor_wasm.js'] });
await mkdir('public/wasm', { recursive: true });
for (const file of ['reactor_wasm.js', 'reactor_wasm_bg.wasm']) {
  await cp(`node_modules/@reactor-team/js-sdk/dist/wasm/${file}`, `public/wasm/${file}`);
}
