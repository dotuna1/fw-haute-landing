import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Cache-Control': 'no-cache',
    ...headers,
  });
  res.end(body);
}

async function serveFile(res, filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      send(res, 404, 'Not found');
      return;
    }

    const body = await readFile(filePath);
    const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';
    send(res, 200, body, { 'Content-Type': contentType });
  } catch {
    send(res, 404, 'Not found');
  }
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/' || pathname === '/index.html') {
    await serveFile(res, join(rootDir, 'index.html'));
    return;
  }

  const safePath = pathname.replace(/^\/+/, '');
  const filePath = join(rootDir, safePath);
  const relativePath = relative(rootDir, filePath);

  if (relativePath.startsWith('..') || relativePath.startsWith('/')) {
    send(res, 400, 'Bad request');
    return;
  }

  await serveFile(res, filePath);
});

server.listen(port, () => {
  console.log(`FW Haute listening on port ${port}`);
});
