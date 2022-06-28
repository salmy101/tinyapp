const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const getUserEmail = function (email, users) {
  let user;
  for (let userID in users) {
    if (users[userID].email === email) {
      user = users[userID];
      return user;
    }
  }
};

function generateRandomString() {
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvqxyz123456789";
  let output = "";
  for (let i = 0; i <= 6; i++) {
    let random = Math.floor(Math.random() * list.length);
    output += list.charAt(random);
  }
  return output;
}

const usersURL = function (userID, urlDatabase) {
  let newObj = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      newObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return newObj;
};

module.exports = { getUserEmail, generateRandomString, usersURL };
