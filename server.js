const express = require('express');
const http = require('http');
const Gun = require('gun');
const path = require('path');

const app = express();
const server = http.createServer(app);
const gun = Gun({ web: server });

app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
const PORT = process.env.PORT || 8080; // Change to 3001 or another unused port

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
