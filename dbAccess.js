

function registerUser(fullName, regNo, email, password, contactNo, college, db) {
  return new Promise(resolve => {
    const docRef = db.collection('users').doc(email);
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
    let user_nameDocRef = await db.collection('users').doc('Amrita').collection('users').doc('sharonjoji99@gmail.com').get();
    user_name = user_nameDocRef.data();
    

    console.log(user_name);
      const docRef =await db.collection('Forum').doc('Amrita').collection('Questions').doc();
      
      docRef.set({
        doc_id:docRef.id ,
        name: user_name.name,
        regNo:user_name.regNo,
        ques_user_id: "sharonjoji99@gmail.com",
        date: date,
        question: ques_desc,
      });
      
      const docRef2 = await db.collection('users').doc('Amrita').collection('users').doc('sharonjoji99@gmail.com').collection('questions').doc().set({
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
      author:user_name.name,
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
  return new Promise(async (resolve) => {
    const docRef = await db.collection('buyAndSell').doc('Amrita').collection('products').doc();
    docRef.set({
      item_name: item_name,
      item_desc: item_desc,
      original_price: original_price,
      selling_price: selling_price,
      seller_id: seller_id,
      item_id: docRef.id
      //add seller_id here pls
    });

     await db.collection('users').doc(college).collection('users').doc(seller_id).collection('product_ads').doc().set({
      item_id:docRef.id
    });
    resolve();
  });

}

exports.addNewProduct = addNewProduct;


function addItemToCart(item_id, buyer, db) {
  return new Promise(async (resolve) => {
    const docRef = await db.collection('users').doc('Amrita').collection('users').doc('sharonjoji99@gmail.com').collection('item_cart').doc();
    docRef.set({
      item_id: item_id,
      buyer: buyer
    });
    resolve();
  });
}

exports.addItemToCart = addItemToCart;


function addLostFound(item_name, place, desc, upload, db) {
  return new Promise(async (resolve) => {
    const docRef = await db.collection('lostAndFound').doc('Amrita').collection('items').doc();
    docRef.set({
      item_name: item_name,
      place: place,
      desc: desc,
      item_pic: upload,
      item_id:docRef.id
    });

     await db.collection('users').doc('Amrita').collection('users').doc('sharonjoji99@gmail.com').collection('lost_and_found').doc().set({
      item_id:docRef.id
    });
    resolve();
  });

}

exports.addLostFound = addLostFound;


function deleteLostAndFound(item_id, college,db) {
  return new Promise(resolve => {
    const docRef = db.collection('lostAndFound').doc(college).collection('items').doc(item_id);
    docRef.delete();
  })
}
exports.deleteLostAndFound = deleteLostAndFound;
