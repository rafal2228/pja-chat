var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

// app config
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index');
});

server.listen(8000);
console.log('Starting server at port: 8000')


var wss = new WebSocketServer({server: server, path: '/api'});
var allWS = [];

wss.on('connection', function(ws){
  var stdin = process.openStdin();
  var id = allWS.length;
  allWS.push(ws);

  stdin.addListener('data', function(data) {
    if(ws.readyState == 1)
      ws.send('System: ' + data.toString().trim());
  });

  ws.on('message', function(message) {
    console.log('Browser: ' + message);
    for(var i = 0; i < allWS.length; i++)
      if(i != id) allWS[i].send('peer' + id + ': ' + message);
  });

  ws.on('close', function(){
    console.log('disconnected');
    stdin.removeListener('data', function(){});
  });
});
console.log('WebSocketServer initialized')
