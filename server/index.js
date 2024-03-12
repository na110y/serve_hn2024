const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const Pusher = require('pusher');

const http = require('http');
const socketIo = require('socket.io');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  queueLimit: 0
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.config.database);
});


const pusher = new Pusher({
  appId: "1770077",
  key: "0624ad209e23f1ff966f",
  secret: "75f23fc257698b21424d",
  cluster: "eu",
  useTLS: true
});




const app = express();
const server = http.createServer(app);
const io = socketIo(server);
process.setMaxListeners(15);

app.use(cors({
  origin : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200', 'http://localhost:8000']
}))

app.use(express.json())


app.get('/api/get-messages', (req, res) => {
  const sql = "SELECT * FROM user_message"; 
  connection.query(sql, function (err, result) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.post('/api/messages', async (req, res) => {
  const { username, message } = req.body;

  await pusher.trigger("chat", "message", {
    username,
    message,
  });

  io.emit('message', {
    username,
    message,
  });

  const sql = "INSERT INTO user_message (username, message) VALUES (?, ?)";
  connection.query(sql, [username, message], function (err, result) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log("1 record inserted");
    res.json([]);
  });
});



app.listen(8080, () => {
  console.log('Server is running on port 8080');
});


