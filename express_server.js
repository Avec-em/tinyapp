// TinyApp Dependancies

const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// function for shortURL
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};

//function for looping through usersDatabase
const emailDuplicates = function(object, key, email) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === email) {
      return true
    }
  }
  return false
};


//URL Database
const urlDatabase = {
  'b2xVn2': "http://www.youtube.com",
  '9sm5xK': "http://www.google.com"
};

//Users Database
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

//URLS JSON
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

//serves user registration page and adds user to the database
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === ''){
    console.log('yes, this condition was met');
    res.status(400).send('Please enter both email and password')
  } 
  else if (emailDuplicates(usersDatabase, 'email', req.body.email)) { 
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
  if (req.body.email === '' || req.body.password === ''){
    res.status(400).send('Please enter both email and password')
  } 
  else if (!emailDuplicates(usersDatabase, 'email', req.body.email)) { 
    res.status(400).send('Email not registered')
  } 
  else if (!emailDuplicates(usersDatabase, 'password', req.body.password)) {
    res.status(400).send('Password not found, please try again\n <a href:local8080/url>')
  }
   else  {
    res.cookie('user_id', 'test');
    res.cookie('email', req.body.email);
    res.redirect('/urls');
  }
});

//serves login page
app.get('/login', (req, res) => {
  let templateVar = {
    username: req.cookies.username,
    user_id: req.cookies.user_id,
    email: req.cookies.email
  };
  res.render('loginPage', templateVar);
})

//handles the logout from client
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.clearCookie('email');
  res.redirect('/urls');
});

// listening at port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});