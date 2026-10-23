import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (outputDirectory !== join(projectRoot, 'dist')) {
  throw new Error('Refusing to build outside the project dist directory.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const entry of [
  'index.html',
  'about.html',
  'terms.html',
  'privacy.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  'assets',
  'css',
  'js',
]) {
  await cp(join(projectRoot, entry), join(outputDirectory, entry), {
    recursive: true,
    force: true,
  });
}

console.log(`Cloudflare Pages files prepared in ${outputDirectory}`);
