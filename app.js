
var dbAcc = require('./dbAccess.js');
var express = require('express');
var app = express();
const bodyParser = require("body-parser") 
const { admin } = require('./firebaseConfig.js');
	
const db = admin.firestore();
  
//fake lost and found items

const posts= [
	{
	  id: 1,
	  author: 'Scooty Keys',
	  title: 'Found on 4th floor',
	  body: 'I found them near the girls lockers outside the library.',
	  imagu: "/img/lost/keys.jpg"
	},
	{
	  id: 2,
	  author: 'Earphones',
	  title: 'Found near two wheeler parking',
	  body: 'Inside the boys hostel compound.. found near a bench.',
	  imagu: "/img/lost/earp.jpg"
	},
	{
	  id: 3,
	  author: 'Wallet',
	  title: 'Found on ATM road',
	  body: 'No ID was in wallet so just sunmitted to admin block.',
	  imagu: "/img/lost/wallet.jpg"
	}
  ]


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

app.post('/register',function(req, res)
{
 var fullName = req.body.fullName;
 var  regNo = req.body.regNo;
 var email= req.body.email;
 var password = req.body.password;
 var contactNo = req.body.contactNo;
 var college = req.body.college;
 dbAcc.registerUser(fullName,regNo,email,password,contactNo,college,db).then(()=>console.log("inserted to db"));


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
	res.render('lostAndFoundPage', {posts:posts});
});

app.get('/lostAndFound/:id', (req, res) => {
	// find the post in the `posts` array
	const post = posts.filter((post) => {
	  return post.id == req.params.id
	})[0]
	// render the `post.ejs` template with the post content
	res.render('post', {
	  author: post.author,
	  title: post.title,
	  body: post.body,
	  imagu: post.imagu
	})
  })

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
