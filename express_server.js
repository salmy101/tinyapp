const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 8080

app.set("view engine", "ejs");

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
app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
res.render("urls_index", templateVars) //name of a template and an object

})

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});