const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// function for shortURL
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};


const urlDatabase = {
  'b2xVn2': "http://www.youtube.com",
  '9sm5xK': "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  let templateVar = { 
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render('url_index', templateVar);
});


app.get("/urls/new", (req, res) => {
  let templateVar = {
    username: req.cookies.username
  }
  res.render("urls_new", templateVar);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVar = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };
  res.render('url_shows', templateVar);
});

// handle client URL and creates unique shortURL
app.post("/urls", (req, res) => {
  let shorty = generateRandomString();
  urlDatabase[shorty] = req.body.longURL;
  res.redirect("/urls/" + shorty);
});


// redirects shortURL link to longURL
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// handles the delete request from client
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
});

// handles the edit request from client
app.post('/urls/:shortURL/update', (req, res) => {
  let newlongURL = req.body.newlongURL
  urlDatabase[req.params.shortURL] = newlongURL
  res.redirect('/urls')
});

//handles the login from client
app.post('/login', (req, res) => {
  console.log(req.body.username)
  res.cookie('username', req.body.username)
  res.redirect('/urls')
});

//handles the logout from client
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

