// Em's TinyApp MiddleWare/Functions ======================================

const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
const { checkDuplicates } = require('./helpers');
const { generateRandomString } = require('./helpers');
const { findUserPass } = require('./helpers');
const { findUserID } = require('./helpers');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'Shh-secret',
  keys: ['Secret', 'rotation'],
}));

// Function for filtering URLS =============================================
const filterURL = function(uId) {
  let filtered = {};
  for (let url in urlDatabase) {
    if ((urlDatabase[url]['user_id']) === uId)
      filtered[url] = urlDatabase[url];
  }
  return filtered;
};

// URL Database ============================================================
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    user_id: "6741j2"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    user_id: "4iddg5"
  },
  htys90: {
    longURL: "https://www.aritzia.com",
    user_id: "4iddg5"
  }
};

// Users Database ==========================================================
const usersDatabase = {
  '4iddg5': {
    id: '4iddg5',
    email: 'emilymnicholas@gmail.com',
    password: '$2b$10$JZaLxXgFi.uR4lts0ai8tuGpb06xikNo81Z/UewXzGiVlDRbh9hmS'
  },
  '6741j2': {
    id: '6741j2',
    email: 'jstamos@compass.com',
    password: '$2b$10$tnhEfM/Gf1uFAV8z0Mb7v.EiCHIKpWXDdtpn5QTRfLf0hMyY51Ze2'
  }
};

//URL ======================================================================
app.get('/', (req, res) => {
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    let templateVar = {
      urls: filterURL(user_id),
      users: usersDatabase,
      user_id: req.session.user_id,
    };
    res.render('url_index', templateVar);
  } else {
    res.redirect('/login');
  }
});

// Serves user list of their URLS ==========================================
app.get('/urls', (req, res) => {
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    let templateVar = {
      urls: filterURL(user_id),
      users: usersDatabase,
      user_id: req.session.user_id,
    };
    res.render('url_index', templateVar);
    //if you are not logged in, error with links
  } else {
    res.send('To view this page, please <a href="/login">Log in</a> or <a href="/Register">Register</a>');
  }
});

// Serves user create new URL page =========================================
app.get('/urls/new', (req, res) => {
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    let templateVar = {
      user_id: req.session.user_id,
      users: usersDatabase,
    };
    res.render('urls_new', templateVar);
    //if you are not logged in, please do so
  } else {
    res.redirect('/login');
  }
});

// Serves user single chosen URL ===========================================
app.get('/urls/:shortURL', (req, res) => {
  // if shortURL requested is associated with your user_id cookie, serve requested page
  if (urlDatabase[req.params.shortURL]['user_id'] === req.session.user_id) {
    let templateVar = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]['longURL'],
      user_id: req.session.user_id,
      users: usersDatabase
    };
    res.render('url_shows', templateVar);
    // else log in or register
  } else {
    res.send('You are only able to view URL\'s that belong to you. Please <a href="/login">Log in</a> or <a href="/Register">Register</a>');
  }
});

// Redirects user to chosen longURL ========================================
app.get('/u/:shortURL', (req, res) => {
  if(res.status() === 500) {
    res.send('hi')
  }
  let longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

// Handles user created URLS and redirects to view =========================
app.post('/urls', (req, res) => {
  let shorty = generateRandomString();
  urlDatabase[shorty] = {
    longURL: req.body.longURL,
    user_id: req.session.user_id
  };
  res.redirect(`/urls/${shorty}`);
});

// Handles url delete ======================================================
app.post('/urls/:shortURL/delete', (req, res) => {
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    // cannot delete unless it is your URL
  } else {
    res.send('not allowed to delete URL\'s that are not yours');
  }
});

// Handles url edit ========================================================
app.post('/urls/:shortURL/update', (req, res) => {
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    let newlongURL = req.body.newlongURL;
    urlDatabase[req.params.shortURL].longURL = newlongURL;

    res.redirect('/urls');
        // cannot edit unless it is your URL
  } else {
    res.send('not allowed to edit URL\'s that are not yours');
  }
});

// Serves user Register page ===============================================
app.get('/register', (req, res) => {
  // if user already exists, redirect to urls, else register!
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    res.redirect('/urls');
  } else {
    let templateVar = {
      user_id: req.session.user_id,
      users: usersDatabase,
    };
    res.render('user_reg', templateVar);
  }
});

// Handles user registration and adds to usersDatabase =====================
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please enter both email and password');
    //checking in email already exists in database
  } else if (checkDuplicates(usersDatabase, req.body.email)) {
    res.status(400).send('Email already registered');
  } else {
    // setting encrypted password
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 10);
    let shorty = generateRandomString();
    usersDatabase[shorty] = {
      id: shorty,
      email: req.body.email,
      password: hash
    };
    //setting user_id
    req.session.user_id = `${shorty}`;
    res.redirect('/urls');
  }
});

// Serves Log in page ======================================================
app.get('/login', (req, res) => {
  // if user already exists, redirect to url, else log in!
  const { user_id } = req.session;
  if (user_id in usersDatabase) {
    res.redirect('/urls');
  } else {
    let templateVar = {
      user_id: req.session.user_id,
      users: usersDatabase,
    };
    res.render('loginPage', templateVar);
  }
});

// Handles login of user ===================================================
app.post('/login', (req, res) => {
  const userPassword = findUserPass(usersDatabase, req.body.email);
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please enter both email and password');
  } else if (!checkDuplicates(usersDatabase, req.body.email)) {
    res.status(400).send('Email not registered, please try again -  <a href="/login">back</a>');
  } else if (!bcrypt.compareSync(req.body.password, userPassword)) {
    res.status(400).send('Password not found, please try again -  <a href="/login">back</a>');
  } else {
    // setting user_id cookie after finding it in current usersDatabase
    req.session.user_id = findUserID(usersDatabase, 'email', req.body.email);
    res.redirect('/urls');
  }
});

// Handles user logout =====================================================
app.post('/logout', (req, res) => {
  //clears cookies!
  req.session = null;
  res.redirect('/urls');
});

// Handles all unknown /* ==================================================
app.get('*', (req, res) =>{
  res.status(404).send('Page not found');
});

// Listening ===============================================================
app.listen(PORT, () => {
  console.log(`Welcome to Em's TinyApp, you are listening to the smooth sounds of port ${PORT}`);
});

