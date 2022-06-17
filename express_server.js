const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 8080
const cookieParser = require('cookie-parser')
<<<<<<< HEAD
app.use(cookieParser())

=======
>>>>>>> master


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
  const templateVars = { urls: urlDatabase , username: req.cookies["username"]}; //username wasnt define because /new use header.ejs
res.render("urls_index", templateVars) 
})
<<<<<<< HEAD
app.get("/urls/new", (req, res) => { 
  const templateVars = { username: req.cookies["username"],};
  res.render("urls_new", templateVars); //this route renders the submission form urls_new to user
=======
app.get("/urls/new", (req, res) => { //place this above the next route so it does not mistake /new as an id
  res.render("urls_new"); //this route renders the submission form urls_new to user
>>>>>>> master
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
  const shortURL = req.params.shortURL
  // console.log(req.params.shortURL)
  const longURL =  urlDatabase[shortURL]
<<<<<<< HEAD
  const templateVars = {shortURL, longURL, username: req.cookies["username"]} ;
=======
  const templateVars = {shortURL, longURL};
>>>>>>> master
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

<<<<<<< HEAD
app.post("/login", (req,res) => {
  res.cookie("username", req.body.username) //res.cookie = giving user a cookie mailing id
  res.redirect("/urls") //!!!
})

app.post("/logout", (req,res) => {
  res.clearCookie("username") // delete request cookie, take it back and dipose
  res.redirect("/urls")
})

=======
// app.post("/login", (req,res) => {
//   res.cookie("req.body.username")
// })

>>>>>>> master
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});