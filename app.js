const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const Message = mongoose.model('Message',{
  name : String,
  message : String
})

const dbUrl = 'mongodb+srv://pristineDev:mYstr0ngPass@cluster0.enlwx.mongodb.net/?retryWrites=true&w=majority'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  message.save((err) =>{
    if(err)
    sendStatus(500);
    res.sendStatus(200);
  })
})

mongoose.connect(dbUrl, () => {
  console.log('mongodb connected');
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('message', async function(msg){
    console.log(msg)
    /**const message = new Message(msg);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })*/
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
