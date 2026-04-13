const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const TARGET_HOST = 'api-sandbox.sweetbook.com';

http.createServer((req, res) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Allow-Headers': '*',
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    if (req.url.startsWith('/v1/')) {
        const apiKey = req.headers['apikey'] || req.headers['authorization']?.replace('Bearer ', '');
        const cleanHeaders = {
            'host': TARGET_HOST,
            'apiKey': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'accept': '*/*',
            'connection': 'keep-alive'
        };

        if (req.headers['content-type']) {
            cleanHeaders['content-type'] = req.headers['content-type'];
        }

        const options = {
            hostname: TARGET_HOST,
            port: 443,
            path: req.url,
            method: req.method,
            headers: cleanHeaders
        };

        const proxyReq = https.request(options, (proxyRes) => {
            const resHeaders = { ...proxyRes.headers, ...corsHeaders };
            res.writeHead(proxyRes.statusCode, resHeaders);
            proxyRes.pipe(res);
        });

        req.pipe(proxyReq);
        proxyReq.on('error', (e) => {
            res.writeHead(500, corsHeaders);
            res.end(e.message);
        });
    } else {
        const file = req.url === '/' ? '/index.html' : req.url;
        fs.readFile(path.join(__dirname, file), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File Not Found");
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(PORT, () => {
    console.log(`🚀 Proxy Server: http://localhost:${PORT}`);
});