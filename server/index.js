const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// 1. Initialize Express and the HTTP Server
const app = express();
const server = http.createServer(app);

// 2. Setup WebSockets for "Real-time visibility for responders" [cite: 12]
const io = new Server(server, {
    cors: { origin: "*" } 
});

app.use(cors());
app.use(express.json()); // Allows the server to read JSON data from reports 

// 3. Basic "Health Check" Route
app.get('/', (req, res) => {
    res.send('Incident Reporting API is running...');
});

// 4. Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});