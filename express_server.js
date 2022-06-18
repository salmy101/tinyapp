const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 3000
const bodyParser = require("body-parser");
// const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser')
app.use(cookieParser())


app.set("view engine", "ejs");

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

const usersURL = function (userID , urlDatabase) { //loop the new database 
  let newObj = {}
    for(const shortURL in urlDatabase) { //access the shortURL and values
      if (urlDatabase[shortURL].userID === userID) { //if id matches add to new obj for user
        newObj[shortURL] = urlDatabase[shortURL]
      }
    }
    return newObj
}

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

app.get('/', (req,res) => {
  res.redirect("/urls")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[id] = longURL /* */
  res.redirect(`urls/${id}`)    //
});

app.get("/urls", (req,res) => {
  const userID = req.cookies["user_id"] //const user = users[req.cookies["user_id"]] 
  const templateVars = { urls: urlDatabase , user: users[userID]}; //username wasnt define because /new use header.ejs
res.render("urls_index", templateVars) 
}) 


app.get("/urls/new", (req, res) => { 
  const userID = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  if (!userID) {
    res.redirect("/login")
  } else {
    const newURL = usersURL(userID, urlDatabase)
    const templateVars = {user: userID, newURL};    
  res.render("urls_new", templateVars); //this route renders the submission form urls_new to user
  }
}); 





// app.get("/urls/:shortURL", (req, res) => { // routue to display a single URL and its shortened form
//   const longURL = urlDatabase[req.params.shortURL]
//   const templateVars = { shortURL: req.params.shortURL, longURL }; //??
//   res.render("urls_show", templateVars);
// });

// app.get("/urls/:id", (req, res) => { // ^^^ the id if the ID of the long url was b2xVn2, then the url would look like /urls/b2xVn2
//   res.render("urls_new")         
// });

app.get("/u/:shortURL", (req, res) => { //this route will direct us to the longURL
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res)=>{
  const user = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  const shortURL = req.params.shortURL
  // console.log(req.params.shortURL)
  const longURL =  urlDatabase[shortURL]
  const templateVars = {shortURL, longURL, user: users[user]} ;
  // console.log(templateVars);
  res.render("urls_show", templateVars)
})

app.post("/urls/:shortURL", (req, res) => { 
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL 
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls") 
})

app.get("/login", (req,res) => {
  const user = req.cookies["user_id"]
  const templateVars = {user: users[user]} ;
  res.render("login", templateVars);
})

app.post("/login", (req,res) => {
  console.log(" ++++++++++++++++++", req.body);
  const email  = req.body.email
  const password = req.body.password 
  if(email === "") {
    return res.status(400).send("email cannot be empty")
  }
  if(password === "") {
    return res.status(400).send("password cannot be empty")

  }
  let user
  for (const userid in users) { 
    if (email === users[userid].email && password === users[userid].password) {
       user = users[userid]
    } 
  }
  if (!user) {
    return res.send("user not found")
  }

  console.log("----------", user)
  res.cookie("user_id", user.id)
  // res.cookie("username", req.body.username) //res.cookie = giving user a cookie mailing id
  res.redirect("/urls") 
})

app.post("/logout", (req,res) => {
  res.clearCookie("user_id") // delete request cookie, take it back and dipose
  res.redirect("/urls")
})

app.get('/register', (req, res) => {
  const userID = req.cookies["user_id"] //const user = users[req.cookies["user_id"]]
  const templateVars = {user: users[userID]}
  res.render('registration', templateVars)
});

app.post('/register', (req, res) => {
  console.log(req.body)
const id = generateRandomString()
const password = req.body.password
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

users[id] = {id: id, email: email, password: password}; 
console.log(users)
res.cookie("user_id", id)
res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});