
// const http = require('http');

// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hyy');
// }).listen(8080);

const http = require('http');
const https = require('https');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/posts' && method === 'GET') {
    handleGetRequest(res);
  } else if (url === '/posts' && method === 'POST') {
    handlePostRequest(req, res);
  } else if (url.startsWith('/posts/') && method === 'PUT') {
    const id = url.split('/')[2];
    handlePutRequest(req, res, id);
  } else if (url.startsWith('/posts/') && method === 'DELETE') {
    const id = url.split('/')[2];
    handleDeleteRequest(res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function handleGetRequest(res) {
  https.get('https://jsonplaceholder.typicode.com/posts', (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });

  }).on('error', (err) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  });
}

function handlePostRequest(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const options = {
      hostname: 'jsonplaceholder.typicode.com',
      path: '/posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let responseData = '';

      apiRes.on('data', (chunk) => {
        responseData += chunk;
      });

      apiRes.on('end', () => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(responseData);
      });
    });

    apiReq.on('error', (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });

    apiReq.write(body);
    apiReq.end();
  });
}

function handlePutRequest(req, res, id) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const options = {
      hostname: 'jsonplaceholder.typicode.com',
      path: `/posts/${id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let responseData = '';

      apiRes.on('data', (chunk) => {
        responseData += chunk;
      });

      apiRes.on('end', () => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(responseData);
      });
    });

    apiReq.on('error', (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });

    apiReq.write(body);
    apiReq.end();
  });
}

function handleDeleteRequest(res, id) {
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: `/posts/${id}`,
    method: 'DELETE',
  };

  const apiReq = https.request(options, (apiRes) => {
    res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Post with ID ${id} deleted.` }));
  });

  apiReq.on('error', (err) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  });

  apiReq.end();
}

