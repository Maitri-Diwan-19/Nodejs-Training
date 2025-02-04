const http = require('http');
const https = require('https');

const PORT = 5000;
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Helper to handle API requests
function apiRequest(method, path, body = null, callback) {
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path,
    method,
    headers: body ? {
      'Content-Type': 'application/json',
    
    } : {}
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  });

  req.on('error', err => callback(err));

  if (body) req.write(body);
  req.end();
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/posts' && method === 'GET') {
    apiRequest('GET', '/posts', null, handleResponse(res));
  } else if (url === '/posts' && method === 'POST') {
    handleRequestBody(req, (body) => {
      apiRequest('POST', '/posts', body, handleResponse(res, 201));
    });
  } else if (url.startsWith('/posts/') && method === 'PUT') {
    const id = url.split('/')[2];
    handleRequestBody(req, (body) => {
      apiRequest('PUT', `/posts/${id}`, body, handleResponse(res));
    });
  } else if (url.startsWith('/posts/') && method === 'PATCH') {
    const id = url.split('/')[2];
    handleRequestBody(req, (body) => {
      apiRequest('PATCH', `/posts/${id}`, body, handleResponse(res));
    });
  } else if (url.startsWith('/posts/') && method === 'DELETE') {
    const id = url.split('/')[2];
    apiRequest('DELETE', `/posts/${id}`, null, handleResponse(res));
  } else {
    sendResponse(res, 404, { error: 'Route Not Found' });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function handleRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

function handleResponse(res, successStatusCode = 200) {
  return (err, data) => {
    if (err) {
      sendResponse(res, 500, { error: err.message });
    } else {
      sendResponse(res, successStatusCode, JSON.parse(data));
    }
  };
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
