var PORT = process.env.PORT || 5000;
var express = require('express');
var path = require('path');
var app = express();



app.use(express.static(path.join(__dirname, 'views')));


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join('/index.html'));
});

app.listen(PORT);