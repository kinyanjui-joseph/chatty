require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});
const mongoose = require('mongoose');
const cors = require('cors');
const timestamp = require('time-stamp');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const dbUrl = process.env.MONGOCONNECTION

const Message = mongoose.model('Message',{
  user_name : String,
  receiver:String,
  message : String,
  id: String,
  time: String
})

const User = mongoose.model('User',{
  user_name : String,
  password : String,
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) return res.sendStatus(403)
      req.user = user
      console.log(user)
      next()
  })
}

app.get('/messages', authenticateToken, (req, res) => {
  Message.find({},(err, messages)=> {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const x = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      //if(err) return res.sendStatus(403)
      return req.user = user
    
    })
    const msg = messages.find(msg => msg.user_name == x.user_name)
    res.send(msg);
    
  })
})

app.get('/users', (req, res) => {
  User.find({},(err, users)=> {
    res.send(users);
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

app.post('/users', async (req, res) => {
  console.log(req.body.user_name)
  try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      
      const user = new User({user_name : req.body.user_name, password: hashedPassword})
      console.log(user)
      user.save(user)
      res.status(201).send()
  } catch {
      res.status(500).send()
  }
})

app.post('/login', async (req, res) => {
  User.find({}, async (err, users)=> {
    const user = users.find(user_name => user_name.user_name == req.body.user_name)
   
     if(user == null){
   return res.status(400).send('user not found')
  }
  try{
   if(await bcrypt.compare(req.body.password, user.password)) {
       //const response = 
       const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET)
       //console.log(accessToken)
       res.json({accessToken : accessToken})
       res.send('success')
   } else {
       res.send('not allowed')
   }
  } catch{
   res.status(500).send()
  }

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
