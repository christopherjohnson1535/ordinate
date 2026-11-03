#!/usr/bin/env node
// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Serves the Ordinate documentation from this machine and opens it in a browser, the way
// `rustup doc` opens the Rust documentation that came with the toolchain. The site is static
// files: no network and no dependencies beyond Node itself.
/* eslint-disable no-console */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const usage = `Usage: ordinate-docs [topic] [options]

Serves the Ordinate documentation on this machine.

  topic           A component or guide to open, such as Table, side-navigation or revisions

Options:
  --open, -o      Open the documentation in the default browser
  --port <n>      Port to listen on (default 4180; the next free port is used if it is taken)
  --host <name>   Address to listen on (default 127.0.0.1)
  --path          Print the folder the built documentation is in and exit
  --site <dir>    Serve another build of the site, such as docs-site/dist
  --version       Print the version of the documentation
  --help, -h      Show this message`;

function parseArguments(argv) {
  const options = { open: false, port: 4180, host: '127.0.0.1', path: false, site: null, topic: null };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const value = () => {
      const next = argv[++index];
      if (next === undefined) fail(`${argument} needs a value.`);
      return next;
    };
    if (argument === '--open' || argument === '-o') options.open = true;
    else if (argument === '--port') options.port = Number(value());
    else if (argument === '--host') options.host = value();
    else if (argument === '--path') options.path = true;
    else if (argument === '--site') options.site = path.resolve(value());
    else if (argument === '--version' || argument === '-v') options.version = true;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument.startsWith('-')) fail(`Unknown option ${argument}.\n\n${usage}`);
    else if (options.topic) fail(`Name one topic at a time.`);
    else options.topic = argument;
  }
  if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535) fail('--port takes a number.');
  return options;
}

function fail(message) {
  console.error(`ordinate-docs: ${message}`);
  process.exit(1);
}

// In the published package the site sits next to bin/ in site/; in a checkout it is docs-site/dist.
function findSite(explicit) {
  const candidates = explicit ? [explicit] : [path.join(here, '../site'), path.join(here, '../dist')];
  const found = candidates.find(dir => fs.existsSync(path.join(dir, 'index.html')));
  if (!found) {
    fail(
      explicit
        ? `No index.html in ${explicit}.`
        : 'The site has not been built. In a checkout of Ordinate, run `npm run docs:build` first.'
    );
  }
  return found;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// Turns "Table", "SideNavigation", "side navigation" or "revisions" into a route of the site.
function resolveTopic(topic, site) {
  const routes = readJson(path.join(site, 'routes.json'));
  if (!routes) return null;
  const slug = topic
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  const component = routes.components.find(folder => folder === slug);
  if (component) return `/components/${component}`;
  const guide = routes.guides.find(route => route.endsWith(`/${slug}`));
  if (guide) return guide;
  const partial = routes.components.find(folder => folder.includes(slug));
  return partial ? `/components/${partial}` : null;
}

// Says when the documentation and the library in the current project are different versions.
function checkProjectVersion(docsVersion) {
  const library = readJson(path.join(process.cwd(), 'node_modules/@ordinate/components/package.json'));
  if (library && docsVersion && library.version !== docsVersion) {
    console.warn(
      `Note: this project uses @ordinate/components ${library.version}, and these docs are for ${docsVersion}.\n` +
        `      Install the matching docs with: npm install --save-dev @ordinate/docs@${library.version}\n`
    );
  }
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

function createServer(site) {
  return http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end();
      return;
    }
    const file = path.join(site, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    // Never serve anything outside the site folder.
    if (path.relative(site, file).startsWith('..')) {
      response.writeHead(403).end();
      return;
    }
    fs.stat(file, (error, stats) => {
      if (error || !stats.isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
      }
      const hashed = /\/assets\//.test(pathname);
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': stats.size,
        // Built assets carry a content hash in their names; the pages themselves must stay fresh.
        'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      if (request.method === 'HEAD') {
        response.end();
      } else {
        fs.createReadStream(file).pipe(response);
      }
    });
  });
}

function listen(server, host, port, attemptsLeft = 20) {
  return new Promise((resolve, reject) => {
    const onError = error => {
      server.off('listening', onListening);
      if (error.code === 'EADDRINUSE' && attemptsLeft > 0 && port !== 0) {
        resolve(listen(server, host, port + 1, attemptsLeft - 1));
      } else {
        reject(error);
      }
    };
    const onListening = () => {
      server.off('error', onError);
      resolve(server.address().port);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, host);
  });
}

function openBrowser(url) {
  const [command, args] =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '""', url]]
        : ['xdg-open', [url]];
  const child = spawn(command, args, { stdio: 'ignore', detached: true });
  child.on('error', () => console.log(`Open ${url} in your browser.`));
  child.unref();
}

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log(usage);
  process.exit(0);
}

const site = findSite(options.site);
const manifest = readJson(path.join(site, 'routes.json')) ?? {};

if (options.version) {
  console.log(manifest.version ?? 'unknown');
  process.exit(0);
}
if (options.path) {
  console.log(site);
  process.exit(0);
}

let route = '/';
if (options.topic) {
  route = resolveTopic(options.topic, site);
  if (!route) fail(`Nothing in the documentation is called "${options.topic}".`);
}

checkProjectVersion(manifest.version);

const server = createServer(site);
const port = await listen(server, options.host, options.port).catch(error => fail(error.message));
const shownHost = options.host === '0.0.0.0' || options.host === '::' ? 'localhost' : options.host;
const url = `http://${shownHost.includes(':') ? `[${shownHost}]` : shownHost}:${port}/#${route}`;

console.log(`Ordinate ${manifest.version ?? ''} documentation`.replace(/\s+/g, ' ').trim());
console.log(`  ${url}`);
console.log('  Press Ctrl+C to stop.');
if (options.open) openBrowser(url);

const stop = () => server.close(() => process.exit(0));
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
