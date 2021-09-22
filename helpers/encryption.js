const bcrypt = require('bcrypt');

const saltRounds = 10;


const encrypt = (password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          console.log('Error hashing password for user', user.firstname);
          next(err);
        } else {
            
          hashedpassword = hash;
          
          
        }
        return hashedpassword;
    })
    
}

let dddd = encrypt('passwordbeintested')
console.log(dddd)