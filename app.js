var express = require('express');
var app = express();

const bodyParser = require("body-parser") 
  
// New app using express module 
 
app.use(bodyParser.urlencoded({ 
    extended:true
}));

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000  ;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');

});


app.post('/login',function(req, res)
{
 console.log(req.body.email);

 console.log(req.body.password);
});

app.get('/dashboard', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('dashboard');
});
app.get('/shopping', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('shopping');
});
app.get('/forum', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('forum');
});

app.get('/lostAndFound', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('lostAndFoundPage');
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
