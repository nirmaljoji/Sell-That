

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

 exports.questionAdd = questionAdd;

function editAnswer(ques_id,desc){
  return new Promise(resolve=>{
    const docRef =  db.collection('Forum').doc(college).collection('Questions').doc(ques_id);
    docRef.update({
      desc : desc
    })
  })
}
exports.answerEdit = answerEdit;

function deleteAnswer(ans_id,college,ques_id){
  return new Promise(resolve=>{
    const docRef = db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').doc(ans_id);
    docRef.delet();
  })
}

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
