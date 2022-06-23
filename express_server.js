const express = require("express");
const PORT = 3000;
const app = express();
const { generateRandomString, usersURL, getUserEmail } = require("./helpers");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: ["this string is a secret key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  a1: {
    id: "a1",
    email: "a@a.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const userID = users[req.session.user_id].id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`urls/${shortURL}`);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: null, user: null };
  if (req.session) {
    templateVars.user = users[req.session.user_id];
    templateVars.urls = usersURL(req.session.user_id, urlDatabase);
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect("/login");
  } else {
    const templateVars = { user };
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

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

  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("registration", templateVars);
});

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

app.get("/login", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserEmail(email, users);
  if (user && bcrypt.compareSync(password, user.hashedPassword)) {
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

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
