

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

 function questionAdd(college,user_id,date,desc){
   return new Promise(resolve => {
     const docRef = db.collection('Forum').doc(college).collection('Questions').doc();
     docRef.set({
       user_id : user_id,
       date : date,
       desc : desc
     })
     
   })
 }

 exports.questionAdd = questionAdd;

function answerEdit(ques_id,desc){
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
    const docRef = db.collection('Forum').doc(college).collection('Questions').doc(ques_id).collection('Answers').
  })
}
