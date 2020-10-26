
var dbAcc = require('./dbAccess.js');
var express = require('express');
var app = express();
const bodyParser = require("body-parser") 
const { admin } = require('./firebaseConfig.js');
	
const db = admin.firestore();
  




 
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
	dbAcc.deleteAnswer(ans_id,college,ques_id,db).then(()=>console.log("inserted  to db"));

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
