const path = require('path');
const config = require('./app.config');
const fakeData = require('./fakeData/users');

const express = require('express');
const redis   = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const server = require('http').Server(app);
const sio = require('socket.io')(server);

var schedule = require('node-schedule');

const redisClient = require('./redisClient');
fakeData(redisClient);

const sessionMiddleware = session({
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    client: redisClient,
    saveUninitialized: true,
    cookie: {
      secure: true
    },
  }),
  secret: config.secret,
});

app.use(sessionMiddleware);
sio.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.use('/node_modules', express.static('node_modules'));
app.use('/public', express.static('public'));


app.get('/room/:roomId', (req, res,next) => {
  //req.session
  if(req.session.user){
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/', (req, res,next) => {
  //req.session
  if(req.session.user){
    res.redirect(`/room/${req.session.user.room}`);
  } else {
    res.redirect('/login');
  }
});

app.get('/login/:userId', (req, res,next) => {
  //req.session
  const userId = req.params.userId;
  redisClient.hgetall(`${config.redis.userPrefix}:${userId}`, (err, userData) => {
    if(!err){
      req.session.user = userData;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  });
});

app.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/logout', (req, res, next) => {
  req.session.user = undefined;
  res.redirect('/');
});



let openRoom = [0,1];
let analyzeList = [];

const calcTop = require('./getTop')(redisClient);

sio.sockets.on('connection', (socket) => {
  //socket.request.session
  console.log(`a user connected`);

  socket.on('getUser', (room, cb) => {
    cb(socket.request.session.user);
  });

  socket.on('audioData', (data, cb) => {
    const timeshtamp = new Date().getTime();
    const keyData = `${config.redis.audioDataPrefix}:${data.user.id}:${timeshtamp}`;
    analyzeList.push({
      user: data.user,
      timeshtamp: timeshtamp,
      key: keyData
    });
    redisClient.hmset(keyData, data.audioData);
  });

  socket.on('room', (result) => {
    socket.join(result.room);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.request.session.user.name} user disconnected`);
  });

});

const sendTop = schedule.scheduleJob('*/2 * * * * *', () => {

  calcTop(analyzeList, (err, data) => {
    console.log(err, data);

    openRoom.forEach((roomId) => {
      // console.log(`send room ${roomId}, top`);
      sio.sockets.in(roomId).emit('top', data[roomId]);
    });

    analyzeList = [];
  });
});

server.listen(config.port, () => {
  console.log(`listening on *: ${config.port}`)
});
