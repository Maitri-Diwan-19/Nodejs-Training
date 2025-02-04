const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const DATA_FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/posts' && method === 'GET') {
    handleReadData(res);
  } else if (url === '/posts' && method === 'POST') {
    handleRequestBody(req, (body) => {
      handleCreatePost(res, body);
    });
  } else if (url.startsWith('/posts/') && method === 'PUT') {
    const id = url.split('/')[2];
    handleRequestBody(req, (body) => {
      handleUpdatePost(res, id, body, true);
    });
  } else if (url.startsWith('/posts/') && method === 'PATCH') {
    const id = url.split('/')[2];
    handleRequestBody(req, (body) => {
      handleUpdatePost(res, id, body, false);
    });
  } else if (url.startsWith('/posts/') && method === 'DELETE') {
    const id = url.split('/')[2];
    handleDeletePost(res, id);
  } else {
    sendResponse(res, 404, { error: 'Route Not Found' });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Helper to read data from the JSON file
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
}

// Helper to write data back to the JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

// Handle GET request
function handleReadData(res) {
  const data = readData();
  
  sendResponse(res, 200, data);
}

// Handle POST request
function handleCreatePost(res, body) {
  const data = readData();
  const newPost = { id: data.length + 1, ...JSON.parse(body) };
  data.push(newPost);
  writeData(data);
  sendResponse(res, 201, newPost);
}

// Handle PUT and PATCH requests
function handleUpdatePost(res, id, body, replace) {
    const data = readData();
    const index = data.findIndex(post => post.id == id);
  
    if (index === -1) {
      sendResponse(res, 404, { error: 'Post Not Found' });
      return;
    }
  
    const updatedPost = replace
      ? { id: parseInt(id), ...JSON.parse(body) }
      : { ...data[index], ...JSON.parse(body) };
  
    data[index] = updatedPost;
    writeData(data);
    sendResponse(res, 200, updatedPost);
  }
  

// Handle DELETE request
function handleDeletePost(res, id) {
    const data = readData();
    const index = data.findIndex(post => post.id == id);
  
    if (index === -1) {
      sendResponse(res, 404, { error: 'Post Not Found' });
      return;
    }
  
    data.splice(index, 1);
    writeData(data);
    sendResponse(res, 200, { message: `Post with ID ${id} deleted.` });
  }
  
// Helper to handle request body
function handleRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

// Helper to send response
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
