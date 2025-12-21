import fs from 'fs';
import {data} from '../data.js';

/**
 * @typedef { import('./types').Route } Route
 */

/**
 * @type { Route[] }
 */

export const routes = [
  {
    name: 'Getting download data',
    method: 'GET',
    endpoint: '/data/download',
    handler: async (req, res) => { 
      console.log('download');
      const downloadData = data.download;
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      const resData = JSON.stringify({ 'download': downloadData });
      res.writeHead(statusCode, headers).end(resData);
    },
  },
  {
    name: 'Getting warranty data',
    method: 'GET',
    endpoint: '/data/warranty',
    handler: async (req, res) => { 
      console.log('warranty');
      const warrantyData = data.warranty;
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      const resData = JSON.stringify({ 'warranty': warrantyData });
      res.writeHead(statusCode, headers).end(resData);
    },
  },
  {
    name: 'Getting care data',
    method: 'GET',
    endpoint: '/data/care',
    handler: async (req, res) => { 
      console.log('care');
      const careData = data.care;
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      const resData = JSON.stringify({ 'care': careData });
      res.writeHead(statusCode, headers).end(resData);
    },
  },
  {
    name: 'Getting cashback data',
    method: 'GET',
    endpoint: '/data/cashback',
    handler: async (req, res) => { 
      console.log('cashback');
      const cashbackData = data.cashback;
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      const resData = JSON.stringify({ 'cashback': cashbackData });
      res.writeHead(statusCode, headers).end(resData);
    },
  },
  {
    name: 'Getting partners data',
    method: 'GET',
    endpoint: '/data/partners',
    handler: async (req, res) => { 
      console.log('partners');
      const partnersData = data.partners;
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      const resData = JSON.stringify({ 'partners': partnersData });
      res.writeHead(statusCode, headers).end(resData);
    },
  },
  {
    name: 'Sending Order data',
    method: 'POST',
    endpoint: '/db/orders',
    handler: async (req, res) => { 
      console.log('orders');
      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      let body = '';
    
      req.on('data', chunk => {
      body += chunk.toString();
    });
      console.log(req.url);
      // const orderData = JSON.stringify();
      // fs.writeFileSync('http://localhost:3000/db/orders', orderData);
  },
}
];
