const express = require('express'); //commonJS pattern
const path = require('path'); //built-in module
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000; //web server port


//https://github.com/socketio/socket.io/issues/936

//socket.io wiring
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('new connection made.');

  //we pass a string event-listener along with JSON payload
  //The string "message-from-server" will be used on client to display our message
  socket.emit('message-from-server', {
    "greeting": "Hello from Server."
  });

  //we also setup event-listner to recieved message from client (reverse of emit)
  socket.on('message-from-client', function(msg){
    console.log(msg.greeting);
  });
});

// //setup public directory for static contents
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());

// //routing
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

//startup
server.listen(port, function () {
  console.log(`server is listening on port: ${port}`);
});