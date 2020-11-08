
var dbAcc = require('./dbAccess.js');
var express = require('express');
var app = express();

const session = require('express-session');
const bodyParser = require("body-parser")
const { admin } = require('./firebaseConfig.js');
const db = admin.firestore();


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


// REGISTER//
app.post('/register', function (req, res) {
	var fullName = req.body.fullName;
	var regNo = req.body.regNo;
	var email = req.body.email;
	var password = req.body.password;
	var contactNo = req.body.contactNo;
	var college = req.body.college;
	dbAcc.registerUser(fullName, regNo, email, password, contactNo, college, db).then(() => {

		console.log("inserted to db");
		res.redirect('/');

	});


});//END REGISTER//

// LOGIN//
app.post('/login', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var college = req.body.college;
	if (email && password) {

		if (dbAcc.checkLogin(email, password, req.session.college, db)) {
			try {
				db.collection('users').doc(college).collection('users').doc(email).get().then(doc => {

					req.session.loggedin = true;
					req.session.email = email;
					req.session.college = doc.data().college;
					res.redirect('/dashboard');
				});

			} catch {
				res.send('Not able to fetch doc');

			}

		}
		else {
			res.send('Incorrect Username and/or Password!');
		}


	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}


});//END LOGIN//



//DASHBOARD//
app.get('/dashboard', async function (req, res) {

	if (req.session.loggedin) {
		console.log('logged in user =' + req.session.email);
		console.log('logged in user, college=' + req.session.college);
		let user_nameDoc_ref = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).get();
		let user_name = await user_nameDoc_ref.data().fullName;
		let requestsDoc_ref = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('product_requests').get();
		let requests = [];
		requestsDoc_ref.forEach(item => {
			requests.push(item.data());
		})

		productCountDoc_ref = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('product_ads').get();
		var productCount = productCountDoc_ref.size;
		answersCountDoc_ref = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('answers').get();
		var answersCount = answersCountDoc_ref.size;

		let notificationsDoc_ref = await db.collection('notifications').doc(req.session.college).collection('notifications').get();
		let notifications = [];
		notificationsDoc_ref.forEach(item => {
			notifications.push(item.data());
		})



		console.log('MY NAAAAME ' + user_name);
		res.render('dashboard', { user_name: user_name, requests: requests, productCount: productCount, answersCount: answersCount, user_college: req.session.college, ads: notifications });
	} else {

		res.send('please login to continue');
	}
	res.end();
});//END DASHBOARD//


//SHOPPING//
app.get('/shopping', async function (req, res) {
	if (req.session.loggedin) {
		try {
			
			let items = await db.collection('buyAndSell').doc(req.session.college).collection('products').get();
			let buys = [];
			
			let product_ads = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('product_ads').get();
			let user_ads = [];
			let adPromises = [];
			
			let your_cartDocRef = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('item_cart').get();
			let your_cart = [];
		

			your_cartDocRef.forEach(item => {
				your_cart.push(item.data());
			});
			
			items.forEach(item => {
				buys.push(item.data());
			});
			
			product_ads.forEach(item => {
				user_ads.push(item.data());
			});
			
			
			for (var i = 0; i < user_ads.length; i++) {
				adPromises.push(new Promise(async (resolve) => {
					let item = await db.collection('buyAndSell').doc(req.session.college).collection('products').doc(user_ads[i].item_id).get();
					let final_item = item.data();
					resolve(final_item);
				}))

			}

			Promise.all(adPromises).then(result => {
				console.log(result);

				res.render('shopping2', { buys: buys, user_ads: result, your_cart: your_cart });
			})


		} catch {

			res.send('Some error');
		}
	} else {
		res.send('please login to continue');
	}
});

app.post('/sellProduct', function (req, res) {
	var item_name = req.body.item_name;
	var item_desc = req.body.item_desc;
	var original_price = req.body.original_price;
	var selling_price = req.body.selling_price;
	//FOR NOW HARDCODING
	//var seller_id=req.session.email;
	//var seller_college=req.session.college;

	var seller_id = req.session.email;
	var college = req.session.college;

	dbAcc.addNewProduct(item_name, item_desc, original_price, selling_price, seller_id, college, db).then(() => {
		console.log("inserted to db");
		return res.redirect('/shopping');
	});


});

app.post('/addToCart/:id', function (req, res) {
	var buyer = req.session.email;
	var college = req.session.college;
	var item_id = req.params.id;
	console.log("params :" + item_id);
	dbAcc.addItemToCart(item_id, buyer,college, db).then(() => {
		console.log("inserted  to db");
		return res.redirect('/shopping');
	});


});

app.post('/delAddedProduct/:id', function (req, res) {
	var item_id = req.params.id;
	var college = req.session.college;
	var logged_user = req.session.email;
	dbAcc.deleteAddedProduct(item_id, logged_user, college, db).then(() => {
		console.log("deleted from db ");
		return res.redirect('/shopping');
	});

});

app.post('/delFromCart/:id', function (req, res) {
	var item_id = req.params.id;
	var college = req.session.college;
	var logged_user = req.session.email;
	dbAcc.deleteFromCart(item_id, logged_user, college, db).then(() => {
		console.log("deleted from cart ");
		return res.redirect('/shopping');

	});
});






//END SHOPPING//



//FORUM//
app.get('/forum', async function (req, res) {

	if (req.session.loggedin) {
		try {
			let AnswersForQues;
			let finalAnswers = []
			let posts = [];
			let doc_id = [];


			let questionsRef = await db.collection('Forum').doc(req.session.college).collection('Questions').get();
			questionsRef.forEach(question => {
				posts.push(question.data())
				doc_id.push(question.id);
			})


			var answerPromises = [];


			//console.log("Answer for ques ->"+AnswersForQues);
			for (var i = 0; i < posts.length; i++) {
				answerPromises.push(new Promise(async (resolve) => {

					console.log('id-' + posts[i].doc_id);
					let answers = await db.collection('Forum').doc(req.session.college).collection('Questions').doc(posts[i].doc_id).collection('Answers').get();
					AnswersForQues = [];
					answers.forEach(answer => {
						//console.log("pls so i can sleep"+answer.data().author);
						AnswersForQues.push(answer.data());
					})

					resolve(AnswersForQues);

				}))
			}

			Promise.all(answerPromises).then(result => {
				var user = req.session.email;
				//console.log("number 1 :"+user+"\n numer 2: "+result[2][0].user_id );
				//console.log(posts);
				res.render('forum', { info: posts, finalAnswers: result, cur_user: user });
			})
		} catch (err) {
			res.send("Error");
		}
	} else {
		res.send('Please Login to Continue');
	}
});


app.post('/question', function (req, res) {
	//var college = req.session.college;
	var college = req.session.college;
	var user_id = req.session.email;
	//var user_id = req.session.email;

	var date = "monday";
	var desc = req.body.Question;
	console.log("umm" + desc);
	dbAcc.addQuestion(college, user_id, date, desc, db).then(() => {
		console.log("inserted  to db");
		return res.redirect('/forum');
	});
});

app.post('/answer/:id', function (req, res) {
	var college = req.session.college;

	var user_id = req.session.email;
	//var college = req.body.college;
	//var user_id = req.body.user_id;
	console.log("thisss ok" + req.params.id);
	var ques_id = req.params.id;
	var ans_desc = req.body.Answer;
	var date = 'mondaaay';
	dbAcc.answerQues(college, user_id, ques_id, ans_desc, date, db).then(() => {
		console.log("inserted  to db");
		res.redirect('/forum');
	});
});
app.post('/EditAns/:id/:id2', function (req, res) {
	var ques_id = req.params.id2;
	var ans_id = req.params.id;
	var desc = req.body.desc;
	var college = req.session.college;
	console.log("question :" + ques_id + "   answer :" + ans_id + "    desc:" + desc);


	dbAcc.editAnswer(ques_id, ans_id, college, desc, db).then(() => {
		console.log("modifications done  to db");
		res.redirect('/forum');
	});
});
app.post('/delete/:id/:id2', function (req, res) {
	var college = req.session.college;

	var user_id = req.session.email;
	var ans_id = req.params.id;
	console.log("here ma" + ans_id);
	//var college = req.body.college;
	var ques_id = req.params.id2;
	var current = req.session.id;


	dbAcc.deleteAnswer(ans_id, college, ques_id, db).then(() => {
		console.log("deleting from db");
		res.redirect('/forum');
	});


	//res.send("You cannot delete");


});//END FORUM//


//LOST AND FOUND//
app.get('/lostAndFound', async function (req, res) {
	if (req.session.loggedin) {
		try {
			let items = await db.collection('lostAndFound').doc(req.session.college).collection('items').get();
			let posts = [];

			let fitems = await db.collection('users').doc(req.session.college).collection('users').doc(req.session.email).collection('lost_and_found').get();
			let foundItems = []
			let fPostsPromises = [];


			items.forEach(item => {
				posts.push(item.data());
			});

			fitems.forEach(item => {
				foundItems.push(item.data());
			});

			for (var i = 0; i < foundItems.length; i++) {
				fPostsPromises.push(new Promise(async (resolve) => {
					let item = await db.collection('lostAndFound').doc(req.session.college).collection('items').doc(foundItems[i].item_id).get();
					let final_item = item.data();
					resolve(final_item);
				}))
			}

			Promise.all(fPostsPromises).then(result => {
				res.render('lostAndFoundPage', { posts: posts, fPosts: result });
			})

		} catch {
			res.send('error modafuka');
		}
	}
	else {
		res.send('Please Login to continue');
	}
});

app.post('/lostFound', function (req, res) {
	var author = req.body.item_name;
	var title = req.body.item_place;
	var body = req.body.item_desc;
	var upload = req.body.upload;
	var college = req.session.college;
	var user_id = req.session.email;
	dbAcc.addLostFound(college, user_id, author, title, body, upload, db).then(() => {
		console.log("inserted  to db");
		return res.redirect('/lostAndFound');
	});


});

app.post('/delLostAndFound/:id', function (req, res) {
	var item_id = req.params.id;
	var college = req.session.college;
	var logged_user = req.session.email;
	console.log("deleting " + item_id);
	dbAcc.deleteLostAndFound(item_id, logged_user, college, db).then(() => {
		console.log("deleted from db");
		return res.redirect('/lostAndFound');
	});

});//END LOST AND FOUND//


app.get('/logout', async function (req, res) {
	req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/');  
        }  
    });  

});
app.listen(port, function () {
	console.log('Our app is running on http://localhost:' + port);
});