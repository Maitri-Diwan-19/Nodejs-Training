const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 1000;
const DATA_FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  try {
    if (url === '/posts' && method === 'GET') {
      await handleReadData(res);
    } else if (url === '/posts' && method === 'POST') {
      await handleRequestBody(req, async (body) => {
        await handleCreatePost(res, body);
      });
    } else if (url.startsWith('/posts/') && method === 'PUT') {
      const id = url.split('/')[2];
      await handleRequestBody(req, async (body) => {
        await handleUpdatePost(res, id, body, true);
      });
    } else if (url.startsWith('/posts/') && method === 'PATCH') {
      const id = url.split('/')[2];
      await handleRequestBody(req, async (body) => {
        await handleUpdatePost(res, id, body, false);
      });
    } else if (url.startsWith('/posts/') && method === 'DELETE') {
      const id = url.split('/')[2];
      await handleDeletePost(res, id);
    } else {
      sendResponse(res, 404, { error: 'Route Not Found' });
    }
  } catch (err) {
    sendResponse(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Helper to read data from the JSON file
async function readData() {
  const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// Helper to write data back to the JSON file
async function writeData(data) {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

// Handle GET request
async function handleReadData(res) {
  const data = await readData();
  sendResponse(res, 200, data);
}

// Handle POST request
async function handleCreatePost(res, body) {
  const data = await readData();
  const newPost = { id: data.length + 1, ...JSON.parse(body) };
  data.push(newPost);
  await writeData(data);
  sendResponse(res, 201, newPost);
}

// Handle PUT and PATCH requests
async function handleUpdatePost(res, id, body, replace) {
  const data = await readData();
  const index = data.findIndex(post => post.id == id);

  if (index === -1) {
    sendResponse(res, 404, { error: 'Post Not Found' });
    return;
  }

  const updatedPost = replace
    ? { id: parseInt(id), ...JSON.parse(body) }
    : { ...data[index], ...JSON.parse(body) };

  data[index] = updatedPost;
  await writeData(data);
  sendResponse(res, 200, updatedPost);
}

// Handle DELETE request
async function handleDeletePost(res, id) {
  const data = await readData();
  const index = data.findIndex(post => post.id == id);

  if (index === -1) {
    sendResponse(res, 404, { error: 'Post Not Found' });
    return;
  }

  data.splice(index, 1);
  await writeData(data);
  sendResponse(res, 200, { message: `Post with ID ${id} deleted.` });
}

// Helper to handle request body
async function handleRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

// Helper to send response
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
