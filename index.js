var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');

  io.emit('user connected');

  socket.on('disconnect', function() {
    var length = clients.length;
    var user;
    for (var i = 0; i < length; i++) {
      if (clients[i][0] === socket) {
        user = clients[i][1];
        clients.splice(i,1);
        break;
      }
    }

    console.log('user disconnected');
    io.emit('user disconnected', user);
    
  });

  socket.on('chat message', function(msg, user) {
    console.log('message: ', msg, user);
    socket.broadcast.emit('chat message', msg, user);
  });

  socket.on('user typing', function(user) {
    clients.push([socket, user]);
    socket.broadcast.emit('user typing', user);
  });

  socket.on('user not typing', function(user) {
    socket.broadcast.emit('user not typing', user);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});