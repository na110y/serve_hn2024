const express = require('express');
const cors = require('cors');

const Pusher = require('pusher');

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
  await pusher.trigger("chat", "message", {
    username: req.body.username,
    message: req.body.message,
  });

  res.json([]);
})

app.listen(3000)


