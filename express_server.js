const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// function for shortURL
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};

//function for email duplicates
const emailDupilcates = function(object, email) {
  for (let i of Object.keys(object)) {
    if (object[i].email === email) {
      return true
    }
  }
  return false
};


const urlDatabase = {
  'b2xVn2': "http://www.youtube.com",
  '9sm5xK': "http://www.google.com"
};

const usersDatabase = {
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
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//serves show all url page
app.get('/urls', (req, res) => {
  let templateVar = {
    urls: urlDatabase,
    username: req.cookies.username,
    user_id: req.cookies.user_id,
    email: req.cookies.email
  };
  res.render('url_index', templateVar);
});

//serves create url page
app.get("/urls/new", (req, res) => {
  let templateVar = {
    username: req.cookies.username,
    user_id: req.cookies.user_id,
    email: req.cookies.email
  };
  res.render("urls_new", templateVar);
});

//serves showurl with shortURL
app.get('/urls/:shortURL', (req, res) => {
  let templateVar = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user_id: req.cookies.user_id,
    email: req.cookies.email
  };
  res.render('url_shows', templateVar);
});

//handles the creation of a new url and adds it to the url Database
app.post("/urls", (req, res) => {
  let shorty = generateRandomString();
  urlDatabase[shorty] = req.body.longURL;
  res.redirect(`/urls/${shorty}`);
});

// serves urlshow and creates shortURL link which leads to longURL
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// handles the delete request from client
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// handles the edit request from client and updates the url Database
app.post('/urls/:shortURL/update', (req, res) => {
  let newlongURL = req.body.newlongURL;
  urlDatabase[req.params.shortURL] = newlongURL;
  res.redirect('/urls');
});

//serves register page when requested
app.get('/register', (req, res) => {
  let templateVar = {
    username: req.cookies.username,
    user_id: req.cookies.user_id,
    email: req.cookies.email
  };
  res.render('user_reg', templateVar);
});

// If the e-mail or password are empty strings, send back a response with the 400 status code.
// If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY


//serves user registration page and adds user to the database
app.post('/register', (req, res) => {
  if (req.body.email === undefined || req.body.password === undefined){
    console.log('yes, this condition was met');
    res.status(400).send('Please enter both email and password')
  } 
  else if (emailDupilcates(usersDatabase, req.body.email)) { 
    res.status(400).send('Email already registered')
  } 
  else {
    let shorty = generateRandomString()
    usersDatabase[shorty] = {
      id: shorty,
      email: req.body.email,
      password: req.body.password
    };
    console.log(usersDatabase)
    res.cookie('user_id', shorty);
    res.cookie('email', req.body.email);
    res.redirect('/urls');
  }
}); 

//handles the login from client
app.post('/login', (req, res) => {
  console.log(req.body.username);
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//handles the logout from client
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.clearCookie('email');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});