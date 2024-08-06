const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path')
const {
  initExpressServer
} = require('./expressServer');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  transports: ['websocket'],  // Use only WebSocket transport
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Data structure to store socket connections by client ID
const clients = new Map();


initExpressServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/home.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Set the client ID received from the client
  socket.on('setId', (id) => {
    console.log('Client ID set:', id);
    
    // Store the socket connection with the client ID
    clients.set(id, socket);
  });

  //listen to location updates
  socket.on('updateLocation', (data) => {
    const { idClient, latitude, longitude } = data;
    clients.set(idClient, { latitude, longitude });
    console.log('Received updated location:', idClient, ":", data);
    // You can handle the updated location data as needed, e.g., save to a database, broadcast to other clients, etc.
    // Broadcast the updated location to all clients
    io.emit('locationUpdate', data);

  });

  // Handle requests for client locations
  socket.on('requestLocation', (idClient) => {
    const location = clients.get(idClient);
    if (location) {
        console.log('Sending location to client', idClient, ':', location);
        socket.emit('locationUpdate', idClient );
    } else {
        console.log('Client location not found:', idClient);
    }
  });
  
  socket.on('disconnect', () => {
    // Remove the socket connection from the data structure when it disconnects
    clients.forEach((value, key) => {
      if (value === socket) {
        clients.delete(key);
        console.log(`Client disconnected with ID: ${key}`);
      }
    });
  });
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

