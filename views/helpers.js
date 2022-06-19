const getUserEmail = function(email, users) {
  let user;
  for (let userID in users) {
    if (users[userID].email === email)
     user = users[userID]
    return user

  }
}

function generateRandomString() {
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvqxyz123456789";
  let output = "";
  for (let i = 0; i <= 6; i++) {
    let random = Math.floor(Math.random() * list.length)
    output += list.charAt(random);
  } 
  return output
}   

const usersURL = function (userID , urlDatabase) { //loop the new database 
  let newObj = {}
    for(const shortURL in urlDatabase) { //access the shortURL and values
      if (urlDatabase[shortURL].userID === userID) { //if id matches add to new obj for user
        newObj[shortURL] = urlDatabase[shortURL]
        // console.log(newObj)
      }
    }
    return newObj
}  


module.exports = { getUserEmail, generateRandomString, usersURL}