const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req,res) => {
  res.send("Welcome!")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 }); 
 app.get("/fetch", (req, res) => { //when client visit /fetch, the a will be undefined! a is not accessible in the other function/callback
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});