const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: false
}));

// Point static path to dist
app.use(express.static(path.join(__dirname, '/dist/totalcab-admin/')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '/dist/totalcab-admin/'));
});

// Get port from environment and store in Express.
let port = process.env.PORT || '6081';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`APP is running on localhost: ${port}`))