
var dbAcc = require('./dbAccess.js');
var express = require('express');
var app = express();
const session = require('express-session');
const bodyParser = require("body-parser")
const { admin } = require('./firebaseConfig.js');
const db = admin.firestore();

const comments= [
	{
	  id: 1,
	  author: 'Harshita Reddy',
	  title: 'ay u take whatever',
	  date: 'September 25, 2020',
	  imagu: "/img/team/harshitaImage1.jpeg"
	},
	{
	  id: 2,
	  author: 'Sharon Joji',
	  title: 'cloud ra i made my own server',
	  date: 'September 25, 2020',
	  imagu: "/img/team/jojo.jpg"
	},
{
	id: 3,
	author: 'Raks',
	title: 'sandwich',
	date: 'September 26, 2020',
	imagu: "/img/team/raks.jpg"
}
]

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	sess = req.session;
	if (sess.email) {
		return res.redirect('/dashboard');
	}
	
	res.render('index');

});

app.post('/register', function (req, res) {
	var fullName = req.body.fullName;
	var regNo = req.body.regNo;
	var email = req.body.email;
	var password = req.body.password;
	var contactNo = req.body.contactNo;
	var college = req.body.college;
	dbAcc.registerUser(fullName, regNo, email, password, contactNo, college, db).then(() => console.log("inserted to db"));


});

app.post('/login', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		
			if (dbAcc.checkLogin(email,password,db)) {
				
				req.session.loggedin = true;
				req.session.email = email;
				
				res.redirect('/dashboard');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}


});





app.get('/dashboard', function (req, res) {

	if (req.session.loggedin) {
		console.log('logged in user ='+req.session.email);
		
		
		res.render('dashboard');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.get('/shopping', async function(req, res) {

	try{
		let items = await db.collection('buyAndSell').doc('Amrita').collection('products').get();
		let buys=[];
		items.forEach(item => {
			buys.push(item.data());
		});
		console.log(buys);
		res.render('shopping', {buys:buys});
	 }catch{

        res.send('Some error');
	 }
});
app.get('/forum', function (req, res) {
	
	
	
	// ejs render automatically looks in the views folder
	res.render('forum');
});
app.post('/question', function (req, res) {
	var college = req.body.college;
	var user_id = req.body.user_id;
	var date = req.body.date;
	var desc = req.body.desc;
	dbAcc.questionAdd(college, user_id, date, desc, db).then(() => console.log("inserted  to db"));


});


app.post('/answer', function (req, res) {
	var college = req.body.college;
	var user_id = req.body.user_id;
	var ques_id = req.body.ques_id;
	var ans_desc = req.body.ans_desc;
	var date = req.body.date;
	dbAcc.answerQues(college, user_id, ques_id, ans_desc, date, db).then(() => console.log("inserted  to db"));
});

app.post('/EditAns', function (req, res) {
	var ques_id = req.body.ques_id;
	var desc = req.body.desc;
	dbAcc.editAnswer(ques_id, desc, db).then(() => console.log("inserted  to db"));
});

app.post('/delete', function (req, res) {
	var ans_id = req.body.ans_id;
	var college = req.body.college;
	var ques_id = req.body.ques_id;
	dbAcc.deleteAnswer(ans_id, college, ques_id, db).then(() => console.log("inserted  to db"));
});


app.get('/lostAndFound', async function (req, res) {

	// ejs render automatically looks in the views folder
     try{
		let items = await db.collection('lostAndFound').doc('Amrita').collection('items').get();
		let posts=[];
		items.forEach(item => {
			posts.push(item.data());
		});
		console.log(posts);
		res.render('lostAndFoundPage', {posts:posts});
	 }catch{

        res.send('Some error');
	 }
	
});
app.post('/lostFound',function(req, res)
{
 var author=req.body.item_name;
 var title=req.body.item_place;
 var body=req.body.item_desc;
 var upload=req.body.upload;
 dbAcc.addLostFound(author,title,body,upload,db).then(()=>console.log("inserted  to db"));


});

app.post('/delLostAndFound',function(req, res)
{

	var item_id=req.body.item_id;
	var college=req.body.college;
	
	dbAcc.deleteLostAndFound(item_id,college,db).then(()=>console.log("deleted from db"));

});

app.listen(port, function () {
	console.log('Our app is running on http://localhost:' + port);
});
