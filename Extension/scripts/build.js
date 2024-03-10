import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import * as pagefind from "pagefind";

const isProdBuild = process.argv.includes('--prod');

main();

async function main() {
  const commonConfig = {
    outbase: './src',
    platform: 'browser',
    external: [],
    bundle: true,
    sourcemap: !isProdBuild,
    minify: isProdBuild,
    tsconfig: './tsconfig.json',
    drop: isProdBuild ? ['console'] : undefined
  };
  const contentJob = build({
    ...commonConfig,
    entryPoints: ['./src/content.ts'],
    outfile: './dist/content.js'
  });

  const backgroundJob = build({
    ...commonConfig,
    entryPoints: ['./src/background.ts'],
    outfile: './dist/background.js'
  });

  const popupJob = build({
    ...commonConfig,
    entryPoints: ['./src/popup/popup.ts'],
    outbase: './src/popup',
    outdir: './dist',
    mainFields: ['svelte', 'module', 'main', 'browser'],
    plugins: [
      sveltePlugin({
        preprocess: sveltePreprocess()
      })
    ]
  });

  const settingsJob = build({
    ...commonConfig,
    entryPoints: ['./src/settings/settings.ts'],
    outbase: './src/settings',
    outdir: './dist',
    mainFields: ['svelte', 'module', 'main', 'browser'],
    plugins: [
      sveltePlugin({
        preprocess: sveltePreprocess()
      })
    ]
  });

  const searchJob = build({
    ...commonConfig,
    entryPoints: ['./src/search/search.ts'],
    outbase: './src/search',
    outdir: './dist',
    mainFields: ['svelte', 'module', 'main', 'browser'],
    plugins: [
      sveltePlugin({
        preprocess: sveltePreprocess()
      })
    ]
  });

  const createLocalSearchIndex = async () => {
    const { index } = await pagefind.createIndex();
    // TODO: Do I want to include the extension's help in the index?
    await index.addDirectory({
      path: "./public/",
    });
    await index.writeFiles({
      outputPath: "./public/pagefind"
    });
  }

  return Promise.all([
    contentJob, backgroundJob,
    popupJob, settingsJob,
    searchJob, createLocalSearchIndex(),
  ]).then(
    () => console.log('⚡ Compiled')
  );
}
