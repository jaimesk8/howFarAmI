// expressServer.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase',
});

function initExpressServer(app) {
  
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

  app.get('/get/:id?', (req, res) => {
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
}

module.exports = { initExpressServer };
