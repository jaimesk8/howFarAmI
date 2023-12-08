const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql2');
const cors = require('cors');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "geoshare"
});

app.post('/loc', (req, res) => {
   const id =req.body.id;
   const lat =req.body.lat;
   const lon =req.body.lon;
   const pos = {
    id: id,
    lat: lat,
    lon: lon,
   }
  executaSQL(`INSERT INTO data (id,lat,lon) VALUES ("${ id }","${ lat }","${ lon }")`, res);
  console.log("client:" , pos);
  res.json(pos);
});

//WEB SOCKET 
wss.on('connection', (ws) => {

   // Generate a unique client ID (for demonstration purposes)
  const clientId = randomId(5);

  // Send the client ID to the client as a string
  ws.send(clientId);
  console.log(`Cliente Connected: ID ${ clientId }`)
  
  // Listen for messages from the client
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${clientId}: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function randomId(length){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

app.get('/get/:id?', (req,res) => {
  
  const id = req.params.id;
  const query = 'SELECT * from data WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error searching for ID:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length === 0) {
      return res.status(404).send('ID not found');
    }
    console.log("Server:",  results[0]);
    res.send(results[0]);
  });
});

// Start the combined server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function executaSQL(sqlQry, res){

  connection.query(sqlQry, (error, results, fields) => {
      if(error)
        res.json(error);
  });
}