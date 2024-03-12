const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  perMessageDeflate: false,
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Xử lý tin nhắn chat
  socket.on('chatMessage', (message) => {
    console.log('Message from client:', message);

    // Gửi lại tin nhắn cho tất cả các client khác
    io.emit('chatMessage', message);
  });

  // Xử lý sự kiện disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});