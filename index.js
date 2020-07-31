var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Welcome to sell-that');
});
app.listen(PORT, function () {
  console.log('Example app listening on port 3000!');
});