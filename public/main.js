const socket = io('http://localhost:8080');

let room;
let user;
let sendData;

socket.on('connect', () => {
  console.log('connect');

  socket.emit('getUser', '', (result) => {

    user = result = result;
    room = result.room;
    socket.emit('room', {room: room});

    socket.on('top', (data) => {
      console.log('top', data);
    });

    sendData = setInterval(() => {
      // console.log('send audio data');
      socket.emit('audioData', {
        user: user,
        audioData: audioData.get(['energy'])
      });
    }, 10);

  });
});

socket.on('disconnect', () => {
  console.log('disconnect');
  clearInterval(sendData);
});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});
