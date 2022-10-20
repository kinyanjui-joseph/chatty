const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require("dotenv").config();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
      origin: "https://kinyanjui-joseph.github.io/chatty/",
      credentials: true
  }
});
const mongoose = require('mongoose');
const cors = require('cors');
const timestamp = require('time-stamp');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const dbUrl = process.env.MONGOCONNECTION

const Message = mongoose.model('Message',{
  name : String,
  message : String,
  id: String,
  time: String
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  io.emit('message', message)
  message.save((err) =>{
    if(err)
    sendStatus(500);
  })
})

mongoose.connect(dbUrl, () => {
  console.log('mongodb connected');
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('message', async function(msg){
    console.log(msg)
  })
 // socket.broadcast.emit('message', msg);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
