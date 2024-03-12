const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const Pusher = require('pusher');

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

const pusher = new Pusher({
  appId: "1770077",
  key: "0624ad209e23f1ff966f",
  secret: "75f23fc257698b21424d",
  cluster: "eu",
  useTLS: true
});




const app = express();

app.use(cors({
  origin : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
}))

app.use(express.json())

app.post('/api/messages', async (req, res) => {
  const { username, message } = req.body;

    // // Lưu dữ liệu vào bảng user_message trong cơ sở dữ liệu hn_2024
    // connection.query(
    //   'INSERT INTO user_message (username, message) VALUES (?, ?)',
    //   [username, message],
    //   (error, results, fields) => {
    //     if (error) {
    //       console.error('Error inserting into user_message:', error.stack);
    //       return res.status(500).json({ error: 'Error inserting into user_message' });
    //     }
  
    //     console.log('Inserted into user_message table:', results);
    //   }
    // );

  await pusher.trigger("chat", "message", {
    username,
    message,
  });

  res.json([]);
});

app.listen(8080)


