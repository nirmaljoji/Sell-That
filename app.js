var PORT = process.env.PORT || 5000;
var express = require('express');
var path = require('path');
var http = require('http');
var app = express();
var server = http.Server(app);



app.use(express.static(path.join(__dirname, 'views')));


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join('/index.html'));
});

server.listen(PORT, function() {
    console.log('Chat server running');
  });