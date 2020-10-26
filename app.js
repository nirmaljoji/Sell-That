
var dbAcc = require('./dbAccess.js');
var express = require('express');
var app = express();
const bodyParser = require("body-parser") 
const { admin } = require('./firebaseConfig.js');
	
const db = admin.firestore();
  
//start of fake lost and found items

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
  //end of fake lost and found items

  //start of fake products for shopping
const buys= [
	{
	  id: 1,
	  author: 'Harshita',
	  title: 'CASIO FX_991EX',
	  body: 'It is 2 years old but acts as though it were brand new :)',
	  imagu: '/img/material/calci.jpeg',
	  ph: '9611402230',
	  email: 'harshita@gmail.com'
	},
	{
		id: 1,
		author: 'Harshita',
		title: 'CASIO FX_991EX',
		body: 'It is 2 years old but acts as though it were brand new :)',
		imagu: '/img/material/calci.jpeg',
		ph: '9611402230',
		email: 'harshita@gmail.com'
	},
	{
		id: 1,
		author: 'Harshita',
		title: 'CASIO FX_991EX',
		body: 'It is 2 years old but acts as though it were brand new :)',
		imagu: '/img/material/calci.jpeg',
		ph: '9611402230',
		email: 'harshita@gmail.com'
	  }
  ]
//end of fake products for shopping

app.use(bodyParser.urlencoded({ 
    extended:true
}));

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000  ;

app.post('/question',function(req, res)
{
 var college=req.body.college;
 var user_id=req.body.user_id;
 var date=req.body.date;
 var desc=req.body.desc;
 dbAcc.questionAdd(college,user_id,date,desc,db).then(()=>console.log("inserted  to db"));


});

app.post('/lostFound',function(req, res)
{
 var firstname=req.body.firstname;
 var lastname=req.body.lastname;
 var details=req.body.details;
 var upload=req.body.upload;
 dbAcc.addLostFound(firstname,lastname,details,upload,db).then(()=>console.log("inserted  to db"));


});

app.post('/delLostAndFound',function(req, res)
{

	var item_id=req.body.item_id;
	var college=req.body.college;
	
	dbAcc.deleteLostAndFound(item_id,college,db).then(()=>console.log("deleted from db"));

});


app.post('/answer',function(req, res)
{

	var college=req.body.college;
	var user_id=req.body.user_id;
	var ques_id=req.body.ques_id;
	var ans_desc=req.body.ans_desc;
	var date=req.body.date;
	dbAcc.answerQues(college,user_id,ques_id,ans_desc,date,db).then(()=>console.log("inserted  to db"));

});

app.post('/EditAns',function(req, res)
{

	var ques_id=req.body.ques_id;
	var desc=req.body.desc;
	dbAcc.editAnswer(ques_id,desc,db).then(()=>console.log("inserted  to db"));

});

app.post('/delete',function(req, res)
{

	var ans_id=req.body.ans_id;
	var college=req.body.college;
	var ques_id=req.body.ques_id;
	dbAcc.deleteAnswer(ans_id,college,ques_id,db).then(()=>console.log("deleted from db"));

});

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');

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

app.post('/login',function(req, res)
{
 console.log(req.body.email);

 console.log(req.body.password);
});


app.get('/dashboard', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('dashboard');
});

app.get('/forum', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('forum');
});

//LOST AND FOUND start

//rendering all the lost products
app.get('/lostAndFound', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('lostAndFoundPage', {posts:posts});
});

app.get('/lostAndFound/:id', (req, res) => {
	// find the post in the `posts` array
	const post = posts.filter((post) => {
	  return post.id == req.params.id
	})[0]
	
	res.render('post', {
	  author: post.author,
	  title: post.title,
	  body: post.body,
	  imagu: post.imagu
	})
  })

//LOST AND FOUND end


//BUY AND SELL start
//(am using same fake db for both buy and sell)
//rendering all the products to buy
app.get('/shopping', function(req, res) {
	res.render('shopping', {buys: buys});
});

app.get('/shopping/:id', (req, res) => {
	const buy = buys.filter((buy) => {
	  return buy.id == req.params.id
	})[0]
	
	res.render('buy', {
	  author: buy.author,
	  title: buy.title,
	  body: buy.body,
	  imagu: buy.imagu,
	  ph: buy.ph,
	  email: buy.email
	})
  })

//BUY AND SELL end

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
