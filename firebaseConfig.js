const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');


	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://sell-that-55f93.firebaseio.com",

		//raks editing
		storageBucket: 'gs://sell-that-55f93.appspot.com'
	  });


 module.exports.admin = admin