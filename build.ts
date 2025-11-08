import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build as esbuild } from 'esbuild';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.join(__dirname, 'dist');

async function build(): Promise<void> {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  let html = fs.readFileSync('index.html', 'utf-8');
  html = html.replace(
    /<script type="module" src=".*"><\/script>/,
    `<script type="module" src="./app.min.js"></script>`
  );
  fs.writeFileSync(path.join(DIST, 'index.html'), html);

  copyRecursive('public', path.join(DIST, 'public'));

  const htmlFiles = collectHtmlFiles(path.join(__dirname, 'src'));
  const templatesCode = generateTemplatesJS(htmlFiles);
  // fs.writeFileSync(path.join(DIST, 'templates.js'), templatesCode);

  let bundle = await bundleClient();
  bundle = templatesCode + '\n' + bundle;
  fs.writeFileSync(path.join(DIST, 'app.min.js'), bundle);
}

function collectHtmlFiles(dir: string): string[] {
  let results: string[] = []

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) results = results.concat(collectHtmlFiles(fullPath));
    else if (path.extname(file) === '.html') results.push(fullPath);
  }

  return results;
}

function generateTemplatesJS(htmlFiles: string[]): string {
  const templates: Record<string, string> = {};

  for (const filePath of htmlFiles) {
    const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    const html = fs
      .readFileSync(filePath, 'utf-8')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${}'); // escape template literals
    templates['./' + relPath] = html;
  }

  const output = `window.templates = ${JSON.stringify(templates, null, 2)};\n`;
  return output;
}

function copyRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    }
    else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function bundleClient(): Promise<string> {
  const result = await esbuild({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    format: 'esm',
    target: 'es2020',
    platform: 'browser',
    write: false,
  });

  const code = result.outputFiles[0].text;

  const minified = await minify(code, { module: true });

  return minified.code || code;
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
})
