import http from 'http';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes } from './routes/routes.js';
import { data } from './data.js';

const PORT = process.env.PORT || 3000;

/**
 * @function handleServerRequest
 * @param { http.IncomingMessage } req 
 * @param { http.ServerResponse } res 
 * @returns { void }
 */

const handleServerRequest = (req, res) => {

  const endpoint = req.url ?? '';

  const findData = routes.find(route => route.endpoint == endpoint);
  if (!findData) return;
  findData.handler(req, res);
  return;
  
};

const server = http.createServer(handleServerRequest);

server.listen(PORT, () => {
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/data`);
  console.log(`📁 Assets: http://localhost:${PORT}/assets/`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
