const express = require('express');
const PORT = 8080
const app = express(); //makes the server/app an object?
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
// const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ["this string is a secret key"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


function generateRandomString() {
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvqxyz123456789";
  let output = "";
  for (let i = 0; i <= 6; i++) {
    let random = Math.floor(Math.random() * list.length)
    output += list.charAt(random);
  } 
  return output
}  



const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    }
}; 

const users = { 
  "a1": {
    id: "a1", 
    email: "a@a.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
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

// const getUserEmail = function(email, users) {
//   for (let userID in users) {
//     if (users[userID].email === email)
//     return users[userID]

//   }
// }


app.get('/', (req,res) => {
  res.redirect("/urls")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const user = users[req.session.user_id]
  const id = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[id] = {longURL, user} /* */
  res.redirect(`urls/${id}`)    //
});

app.get("/urls", (req,res) => {
  // const userID = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  const user = users[req.session.user_id]
  console.log("+++++++++++", users);
  console.log("+++++++", req.session)
  const newURLs = usersURL(user, urlDatabase) //user as in the cookie session line 95
  const templateVars = { urls: newURLs , user }; //username wasnt define because /new use header.ejs
res.render("urls_index", templateVars) 
}) 

app.get("/urls/new", (req, res) => { 
  // const userID = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  const user = users[req.session.user_id]
  if (!user) {
    res.redirect("/login")
  } else {
    const templateVars = { user };    
  res.render("urls_new", templateVars); //this route renders the submission form urls_new to user
  }
}); 

app.get("/u/:shortURL", (req, res) => { //this route will direct us to the longURL
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res)=>{
  // const user = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  const user = users[req.session.user_id]
  const shortURL = req.params.shortURL
  console.log("--------", shortURL, urlDatabase)
  const longURL =  urlDatabase[shortURL]
  const templateVars = {shortURL, longURL, user} ;
  // console.log(templateVars);
  res.render("urls_show", templateVars)
})

app.post("/urls/:shortURL", (req, res) => { 
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL].longURL = longURL //urlDatabase[shortURL] = longURL 
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req,res) => { 
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls") 
})

app.get("/login", (req,res) => {
  const user = users[req.session.user_id]
  const templateVars = { user }
  res.render("login", templateVars);
})

app.post("/login", (req,res) => {
  // console.log(" ++++++++++++++++++", req.body);
  const email  = req.body.email
  const password = req.body.password 
  if(email === "") {
    return res.status(400).send("email cannot be empty")
  }
  if(password === "") {
    return res.status(400).send("password cannot be empty")
  }
  let user
  for (const userID in users) { 
    console.log("-------------", users[userID])
    if (email === users[userID].email && bcrypt.compareSync(password, users[userID].hashedPassword)) {
       user = users[userID]
    } 
  }
  if (!user) {
    return res.send("user not found, please register new account")
  }

  console.log("----------", user) 
  req.session.user_id = user.id// res.cookie("user_id", user.id) 
  res.redirect("/urls") 
})



app.post("/logout", (req,res) => {
  req.session = null; //res.clearCookie("user_id") // delete request cookie, take it back and dipose
  res.redirect("/urls")
})

app.get('/register', (req, res) => {
  // const userID = req.cookies["user_id"] 
  const user = users[req.session.user_id]
  const templateVars = { user }
  res.render('registration', templateVars)
});

app.post('/register', (req, res) => {
  // console.log(req.body)
const id = generateRandomString()
const password = req.body.password
const hashedPassword = bcrypt.hashSync(password, 10);
const email = req.body.email 
  if(email === "") {
    return res.status(400).send("email cannot be empty")
  }
  if(password === "") {
    return res.status(400).send("password cannot be empty")
  }
  for (const user in users) {
    if (users[user].email === email) {
      return res.status(400).send("email already exist")
    }
  }
users[id] = {id: id, email: email, hashedPassword}; 
console.log("user after registration", users)
req.session.user_id = id //res.cookie("user_id", id) 
res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});