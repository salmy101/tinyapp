const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 8080
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com", 
}; 

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const bodyParser = require("body-parser");
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));

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
  const user = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase , username: user}; //username wasnt define because /new use header.ejs
res.render("urls_index", templateVars) 
})
app.get("/urls/new", (req, res) => { 
  const user = users[req.cookies["user_id"]]
  const templateVars = { username: user};
  res.render("urls_new", templateVars); //this route renders the submission form urls_new to user
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
  const user = users[req.cookies["user_id"]]
  const shortURL = req.params.shortURL
  // console.log(req.params.shortURL)
  const longURL =  urlDatabase[shortURL]
  const templateVars = {shortURL, longURL, username: user} ;
  // console.log(templateVars);
  res.render("urls_show", templateVars)
})

app.post("/urls/:shortURL", (req, res) => { 
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  console.log(shortURL);
  urlDatabase[shortURL] = longURL 
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls") //??
})

app.post("/login", (req,res) => {
  res.cookie("username", req.body.username) //res.cookie = giving user a cookie mailing id
  res.redirect("/urls") //!!!
})

app.post("/logout", (req,res) => {
  res.clearCookie("username") // delete request cookie, take it back and dipose
  res.redirect("/urls")
})

app.get('/register', (req, res) => {
  const user = users[req.cookies["user_id"]]
  // console.log(user);
  const templateVars = {username: user}
  res.render('registration', templateVars)
});

app.post('/register', (req, res) => {
const id = generateRandomString()
const email = req.body.email
const password = req.body.password
// console.log(id, email, password)
users[id] = {id: id, email: email, password: password};
console.log(users)
res.cookie("user_id", id)
res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});