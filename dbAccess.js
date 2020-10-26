

 function registerUser(fullName,regNo,email,password,contactNo,college,db) {
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

 function addQuestion(college,user_id,date,ques_desc){
   return new Promise(resolve => {
     const docRef = db.collection('Forum').doc(college).collection('Questions').doc();
     docRef.set({
       ques_user_id : user_id,
       date : date,
       ques_desc : ques_desc
     })
     
   })
 }

 exports.addQuestion = addQuestion;

function editAnswer(ques_id,desc){
  return new Promise(resolve=>{
    const docRef =  db.collection('Forum').doc(college).collection('Questions').doc(ques_id);
    docRef.update({
      desc : desc
    })
  })
}
exports.editAnswer = editAnswer;

function deleteAnswer(ans_id,college,ques_id){
  return new Promise(resolve=>{
    const docRef = db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc(ans_id);
    docRef.delet();
  })
}
exports.deleteAnswer = deleteAnswer;

function answerQues(college,user_id,ques_id,ans_desc,date){
  return new Promise(resolve=>{
    const docRef = db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc();
    docRef.set({
      ques_id :ques_id,
      ans_desc:ans_desc,
      ans_date : date,
      ans_user_id :user_id


    }) 
  })
}
exports.answerQues = answerQues;


function addLostFound(firstname,lastname,details,upload,db) {
  return new Promise(resolve => {
      const docRef = db.collection('lostAndFound').doc(college).collection('items').doc();
      docRef.set({
        firstname: firstname,
        lastname: lastname,
        details: details,
        password: password,
        upload: upload,
        
      });
    resolve();
  });
}

exports.addLostFound = addLostFound;

function deleteLostAndFound(item_id,college){
  return new Promise(resolve=>{
    const docRef = db.collection('lostAndFound').doc(college).collection('items').doc(item_id);
    docRef.delet();
  })
}
exports.deleteLostAndFound = deleteLostAndFound;

