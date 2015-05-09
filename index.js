var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  io.emit('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
    io.emit('user disconnected');
  });

  socket.on('chat message', function(msg, user) {
    console.log('message: ', msg, user);
    socket.broadcast.emit('chat message', msg, user);
  });

  socket.on('user typing', function(user) {
    socket.broadcast.emit('user typing', user);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});