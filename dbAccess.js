

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

  