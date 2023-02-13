import { join } from 'path';
import fs from 'fs-extra';
import { build as viteBuild, InlineConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import ora from 'ora';

import {
	CLIENT_ENTRY_PATH,
	SERVER_ENTRY_PATH,
	PACKAGE_ROOT
} from './constants';

export async function bundle(root: string) {
	const resolveViteConfig = (isServer: boolean): InlineConfig => ({
		mode: 'production',
		root,
		build: {
			ssr: isServer,
			outDir: join(PACKAGE_ROOT, root, isServer ? '.temp' : 'build'),
			rollupOptions: {
				input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
				output: {
					format: isServer ? 'cjs' : 'esm'
				}
			}
		}
	});

	ora('Building client + server bundles...');

	try {
		const [clientBundle, serverBundle] = await Promise.all([
			// client build
			viteBuild(resolveViteConfig(false)),
			// server build
			viteBuild(resolveViteConfig(true))
		]);
		return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
	} catch (e) {
		console.log(e);
	}
}

export async function renderPage(
	render: () => string,
	root: string,
	clientBundle: RollupOutput
) {
	const clientChunk = clientBundle.output.find(
		(chunk) => chunk.type === 'chunk' && chunk.isEntry
	);
	console.log('Rendering page in server side...');
	const appHtml = render();
	const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
	await fs.ensureDir(join(PACKAGE_ROOT, root, 'build'));
	await fs.writeFile(join(PACKAGE_ROOT, root, 'build/index.html'), html);
	await fs.remove(join(PACKAGE_ROOT, root, '.temp'));
}

export async function build(root: string = process.cwd()) {
	// 1. bundle - client 端 + server 端
	const [clientBundle] = await bundle(root);
	// 2. 引入 server-entry 模块
	const serverEntryPath = join(PACKAGE_ROOT, root, '.temp', 'ssr-entry.cjs');
	console.log(
		'join(PACKAGE_ROOT, root, "build")',
		join(PACKAGE_ROOT, root, 'build')
	);
	console.log('serverEntryPath', serverEntryPath);
	const { render } = await import(serverEntryPath);
	// 3. 服务端渲染，产出 HTML
	await renderPage(render, root, clientBundle);
}
