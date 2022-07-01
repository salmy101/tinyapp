const express = require("express");
const PORT = 8080;
const app = express();
const { generateRandomString, usersURL, getUserEmail } = require("./helpers");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["this string is a secret key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const urlDatabase = {};
const users = {};

//routing to homepage
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//route to post the URLs
app.post("/urls", (req, res) => {
  const userID = users[req.session.user_id].id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`urls/${shortURL}`);
});

//route to show the list of users tinyURL (renders the index)
app.get("/urls", (req, res) => {
  let templateVars = { urls: null, user: null };
  if (req.session) {
    templateVars.user = users[req.session.user_id];
    templateVars.urls = usersURL(req.session.user_id, urlDatabase);
  }
  res.render("urls_index", templateVars);
});

//route to create new tinyURL
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect("/login");
  } else {
    const templateVars = { user };
    res.render("urls_new", templateVars);
  }
});

//this route will redirect you to the longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//route to show edit page for logged in user, or redirect a non-logged in user to the login page
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = { shortURL, longURL, user };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

//Route to edit a longURL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

//route for deleting shortURL only by the owner, prints message if some unathorized person tries to delete the users shortURL (for example, in commandline with cURL)
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.user_id];
  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    return res
      .status(401)
      .send("Nice try slick, but you cannot delete this! #BOZO");
  }
});

//route to registration page
app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("registration", templateVars);
});

//route for registration. will add new user in databse with user, email, and passowrd,  also error handling incase email alardy exists.
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = req.body.email;
  if (email === "") {
    return res.status(400).send("email cannot be empty");
  }
  if (password === "") {
    return res.status(400).send("password cannot be empty");
  }
  for (const user in users) {
    if (users[user].email === email) {
      return res.status(400).send("email already exist");
    }
  }
  users[id] = { id: id, email: email, hashedPassword };
  req.session.user_id = id;
  res.redirect("/urls");
});

//route to login page
app.get("/login", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("login", templateVars);
});

//route for login, checks if email and password match the ones in the users database, also some error handling in case of missing or incorrect credentials
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserEmail(email, users);
  console.log(user);
  if (
    user &&
    user.hashedPassword &&
    bcrypt.compareSync(password, user.hashedPassword)
  ) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else if (email === "") {
    return res.status(400).send("email cannot be empty");
  } else if (password === "") {
    return res.status(400).send("password cannot be empty");
  } else {
    return res.status(400).send("user not found, please register new account");
  }
});

//route for logout, will erase req.session user cookie and redirect to homepage
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//will send message once connection is established.
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
