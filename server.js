import http from 'http';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { data } from './data.js';

const PORT = process.env.PORT || 3000;

// Папка со статическими файлами
const ASSETS_DIR = path.join(__dirname, 'assets');

// MIME типы для поддерживаемых файлов
const MIME_TYPES = {
  '.ttf': 'font/ttf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

/**
 * Проверяет, является ли путь запросом к статическому файлу
 */
const isAssetFile = (pathname) => {
  return pathname.startsWith('/assets/');
};

/**
 * Обслуживает статический файл из папки assets
 */
const serveAssetFile = (filePath, res) => {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'File not found',
        path: filePath
      }));
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
};

/**
 * Основной обработчик запросов
 */
const requestHandler = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Логируем запрос
  console.log(`${req.method} ${pathname}`);

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Обработка OPTIONS запросов
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: GET /api/data
  if (req.method === 'GET' && pathname === '/api/data') {
    const response = {
      message: 'Data retrieved successfully',
      timestamp: new Date().toISOString(),
      data: data
    };

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(response, null, 2));
    return;
  }

  // Обслуживание файлов из папки assets
  if (req.method === 'GET' && isAssetFile(pathname)) {
    // Убираем /assets/ из пути и ищем файл в assets папке
    const relativePath = pathname.replace('/assets/', '');
    const filePath = path.join(ASSETS_DIR, relativePath);

    // Проверяем существует ли файл
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Asset not found',
          path: pathname
        }));
      } else {
        serveAssetFile(filePath, res);
      }
    });
    return;
  }

  // Корневой путь - простая информационная страница
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Node.js Server</title>
        <style>
          body { 
            font-family: monospace; 
            margin: 40px; 
            line-height: 1.5;
          }
          h1 { margin-bottom: 20px; }
          .endpoint { 
            margin: 20px 0; 
            padding: 15px; 
            background: #f0f0f0;
          }
          code { background: #ddd; padding: 2px 4px; }
        </style>
      </head>
      <body>
        <h1>Node.js Server</h1>
        
        <div class="endpoint">
          <h3>API:</h3>
          <code>GET <a href="/api/data">/api/data</a></code> - JSON данные
        </div>
        
        <div class="endpoint">
          <h3>Статические файлы:</h3>
          <p>Все файлы в папке <code>assets/</code></p>
          <ul>
            <li><code>/assets/fonts/</code> - шрифты .ttf</li>
            <li><code>/assets/images/</code> - картинки .jpg, .png</li>
            <li><code>/assets/icons/</code> - иконки .svg</li>
          </ul>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // Все остальное - 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not found',
    message: `Cannot ${req.method} ${pathname}`
  }));
};

// Создаем и запускаем сервер
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/data`);
  console.log(`📁 Assets: http://localhost:${PORT}/assets/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});