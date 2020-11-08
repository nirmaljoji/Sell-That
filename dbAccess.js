

function registerUser(fullName, regNo, email, password, contactNo, college, db) {
  return new Promise(resolve => {
    const docRef = db.collection('users').doc(college).collection('users').doc(email);
    docRef.set({
      fullName: fullName,
      regNo: regNo,
      email: email,
      password: password,
      contactNo: contactNo,
      college: college,
    });
    resolve();
  });
}

exports.registerUser = registerUser;

function addQuestion(college, user_id, date, ques_desc, db) {
  return new Promise(async (resolve) => {
    let user_nameDocRef = await db.collection('users').doc(college).collection('users').doc(user_id).get();
    user_name = user_nameDocRef.data();
    

    console.log(user_name);
      const docRef =await db.collection('Forum').doc(college).collection('Questions').doc();
      
      docRef.set({
        doc_id:docRef.id ,
        name: user_name.fullName,
        regNo:user_name.regNo,
        ques_user_id:user_id,
        date: date,
        question: ques_desc,
      });
      
      const docRef2 = await db.collection('users').doc(college).collection('users').doc(user_id).collection('questions').doc().set({
        user_id: docRef.id,
      })
      resolve();

    

  })
}

exports.addQuestion = addQuestion;

function editAnswer(ques_id,ans_id,college, desc,db) {
  return new Promise(resolve => {
    const docRef = db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc(ans_id);
    docRef.update({
      title: desc
    })
    resolve();
  })
}
exports.editAnswer = editAnswer;

function deleteAnswer(ans_id, college, ques_id,db) {
  return new Promise(async(resolve) => {
    const docRef = await db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc(ans_id).delete();
    //docRef.delete();
    resolve();
  })
}
exports.deleteAnswer = deleteAnswer;

function answerQues(college, user_id, ques_id, ans_desc, date,db) {
  return new Promise(async (resolve) => {

    let user_nameDocRef = await db.collection('users').doc(college).collection('users').doc(user_id).get();
    user_name = user_nameDocRef.data();

    const docRef =await  db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc();
    await docRef.set({
      ans_id:docRef.id,
      author:user_name.fullName,
      title: ans_desc,
      ans_date: date,
      user_id: user_id,
    })
    console.log(docRef.id);
    await db.collection('users').doc(college).collection('users').doc(user_id).collection('answers').doc().set({
      ans_id : docRef.id,
    })

    resolve();
  })
}
exports.answerQues = answerQues;

async function retCollege(email, db) {

  try {
    const docRef = db.collection('users').doc(email);
    const doc = await docRef.get();
    return doc.data().college;


  }
  catch {
    console.log('Error');
  }

}

exports.retCollege = retCollege;



async function checkLogin(email, password, college ,db) {

  try {
    const docRef = db.collection('users').doc(college).collection('users').doc(email);
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No matching documents.');
      return false;
    }

    if (doc.data().password == password) {
      console.log('Correct info');
      return true;
    } else {
      console.log('Invalid password');
      return false;

    }
  }
  catch {
    console.log('error');
  }


}
exports.checkLogin = checkLogin;

function addNewProduct(item_name,item_desc,original_price,selling_price,seller_id,college,db) {
  return new Promise( async (resolve) => {
    const docRef =  db.collection('buyAndSell').doc(college).collection('products').doc();
    docRef.set({
      item_name: item_name,
      item_desc: item_desc,
      original_price: original_price,
      selling_price: selling_price,
      seller_id: seller_id,
      item_id: docRef.id
      //add seller_id here pls
    });
    let user_nameDocRef = await  db.collection('users').doc(college).collection('users').doc(seller_id).get();
    user_name = user_nameDocRef.data().fullName;

      db.collection('users').doc(college).collection('users').doc(seller_id).collection('product_ads').doc().set({
      item_id:docRef.id
    });

    db.collection('notifications').doc(college).collection('notifications').doc().set({
      info_noti:selling_price,
      name : user_name,
      notiType:'posted an Ad for',
      product_name: item_name
    });



    resolve();
  });

}

exports.addNewProduct = addNewProduct;


function addItemToCart(item_id,user_id,college, db) {
  return new Promise(async (resolve) => {
    var  ad_posted_by ;
    var item_name;
    const userDocRef = await db.collection('buyAndSell').doc(college).collection('products').where('item_id','==',item_id).get();
    userDocRef.forEach(doc=>{
      ad_posted_by = doc.data().seller_id;
      item_name = doc.data().item_name;
    })
   
    const phDocRef = await db.collection('users').doc(college).collection('users').doc(ad_posted_by).get();
    const phone_no = phDocRef.data().contactNo;
    
    const docRef = await db.collection('users').doc(college).collection('users').doc(user_id).collection('item_cart').doc();
    docRef.set({
      item_id: item_id,
      seller_no : phone_no,
      seller_email : ad_posted_by,
      item_name :item_name
    });
    
    let user_nameDocRef = await db.collection('users').doc(college).collection('users').doc(user_id).get();
    user_name = user_nameDocRef.data().fullName;
    
    
    db.collection('users').doc(college).collection('users').doc(ad_posted_by).collection('product_requests').doc().set({
      req_name : user_name,
      req_product :item_name
    });
    

    resolve();
  });
}

exports.addItemToCart = addItemToCart;

function deleteAddedProduct(item_id, logged_user,college,db) {
  console.log("check for item id"+college);
  return new Promise(resolve => {
  
    const userDocRef = db.collection('users').doc(college).collection('users').doc(logged_user).collection('product_ads').where('item_id','==',item_id);
    userDocRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })


    const docRef = db.collection('buyAndSell').doc(college).collection('products').doc(item_id);
    docRef.delete();
    const cartDocRef = db.collection('users').doc(college).collection('users').doc(logged_user).collection('item_cart').where('item_id','==',item_id);
    cartDocRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })
   
    
   resolve();

  })
}
exports.deleteAddedProduct = deleteAddedProduct;

function deleteFromCart(item_id, logged_user,college,db) {
  console.log("check for item id"+college);
  return new Promise(resolve => {
    
    const userDocRef = db.collection('users').doc(college).collection('users').doc(logged_user).collection('item_cart').where('item_id','==',item_id);
    userDocRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })
   resolve();

  })
}
exports.deleteFromCart = deleteFromCart;



function addLostFound(college, user_id, item_name, place, desc, upload, db) {
  return new Promise(async (resolve) => {
    const docRef = await db.collection('lostAndFound').doc(college).collection('items').doc();
    docRef.set({
      item_name: item_name,
      place: place,
      desc: desc,
      item_pic: upload,
      item_id:docRef.id
    });

     await db.collection('users').doc(college).collection('users').doc(user_id).collection('lost_and_found').doc().set({
      item_id:docRef.id
    });
    resolve();
  });

}

exports.addLostFound = addLostFound;


function deleteLostAndFound(item_id,logged_user, college,db) {
  return new Promise(resolve => {
    const docRef = db.collection('lostAndFound').doc(college).collection('items').doc(item_id);
    docRef.delete();
    const userAddedTabRef=db.collection('users').doc(college).collection('users').doc(logged_user).collection('lost_and_found').where('item_id','==',item_id);
    userAddedTabRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })
    resolve();
  })
}
exports.deleteLostAndFound = deleteLostAndFound;
