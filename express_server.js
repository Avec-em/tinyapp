// Em's TinyApp MiddleWare ====================================

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['Shh-Secret'],
}))

// Function for generating random string ===================================
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};

// Function for checking email/pass ========================================
const checkDuplicates = function(object, key, value) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === value) {
      return true
    }
  }
  return false
};

// Function for filtering URLS =============================================
const filterURL = function(uId) {
  let filtered = {};
  for (let url in urlDatabase) {
    if ((urlDatabase[url]['user_id']) === uId)
    filtered[url] = urlDatabase[url]
  }
  return filtered
}

// Function for finding userID =============================================
const findUserID = function (object, key, email) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === email) {
      return object[i]['id']
    }
  }
};

const findUserPass = function (object, email) {
  for (let i of Object.keys(object)) {
    if (object[i]['email'] === email) {
      return object[i]['password']
    }
  }
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

//URLS.JSON ================================================================
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Serves user list of their URLS ==========================================
app.get('/urls', (req, res) => {
  const { user_id } = req.session;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
    let templateVar = {
      urls: filterURL(user_id),
      users: usersDatabase,
      user_id: req.session.user_id,
    };
    res.render('url_index', templateVar);
  } else {
    res.send('Please <a href="/login">Log in</a> or <a href="/Register">Register</a>')
  }
});

// Serves user create new URL page =========================================
app.get("/urls/new", (req, res) => {
  const { user_id } = req.session;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
    let templateVar = {
      user_id: req.session.user_id,
      users: usersDatabase,
    };
    res.render("urls_new", templateVar);
  } else {
    res.redirect('/login')
  }
});

// Serves user single chosen URL ===========================================
app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]['user_id'] === req.session.user_id){
  let templateVar = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user_id: req.session.user_id,
    users: usersDatabase,
  };
  res.render('url_shows', templateVar);
} else {
  res.send('You are only able to view URL\'s that belong to you')
}
});

// Redirects user to chosen longURL ========================================
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

// Handles user created URLS and redirects to view =========================
app.post("/urls", (req, res) => {
  let shorty = generateRandomString();
  urlDatabase[shorty] = {
    longURL: req.body.longURL,
    user_id: req.session.user_id
  };
  console.log(urlDatabase)
  res.redirect(`/urls/${shorty}`);
});

// Handles url delete ======================================================
app.post('/urls/:shortURL/delete', (req, res) => {
  const { user_id } = req.session;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
  } else {
    res.send('not allowed to delete URL\'s that are not yours')
  }
});

// Handles url edit ========================================================
app.post('/urls/:shortURL/update', (req, res) => {
  const { user_id } = req.session;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
  let newlongURL = req.body.newlongURL;
  //store in a variable - curent URL
  //fetch URL 
  urlDatabase[req.params.shortURL].longURL = newlongURL;
  res.redirect('/urls');
  } else {
    res.send('not allowed to delete URL\'s that are not yours')
  }
});

// Serves user Register page ===============================================
app.get('/register', (req, res) => {
  let templateVar = {
    user_id: req.session.user_id,
    users: usersDatabase,
  };
  res.render('user_reg', templateVar);
});

// Handles user registration and adds to usersDatabase =====================
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === ''){
    console.log('yes, this condition was met');
    res.status(400).send('Please enter both email and password')
  } 
  else if (checkDuplicates(usersDatabase, 'email', req.body.email)) { 
    res.status(400).send('Email already registered')
  } 
  else {
    const password = req.body.password
    const hash = bcrypt.hashSync(password, 10);
    let shorty = generateRandomString()
    usersDatabase[shorty] = {
      id: shorty,
      email: req.body.email,
      password: hash
    };
    console.log(usersDatabase)
    req.session.user_id = `${shorty}`
    res.redirect('/urls');
  }
}); 

// Serves Log in page ======================================================
app.get('/login', (req, res) => {
  let templateVar = {
    user_id: req.session.user_id,
    users: usersDatabase,
  };
  res.render('loginPage', templateVar);
})

// Handles login of user ===================================================
app.post('/login', (req, res) => {
  const userPassword = findUserPass(usersDatabase, req.body.email)
  if (req.body.email === '' || req.body.password === ''){
    res.status(400).send('Please enter both email and password')
  } 
  else if (!checkDuplicates(usersDatabase, 'email', req.body.email)) { 
    res.status(400).send('Email not registered')
  } 
  else if (!bcrypt.compareSync(req.body.password, userPassword)) {
    res.status(400).send('Password not found, please try again')
  }
   else  {
     req.session.user_id = findUserID(usersDatabase, 'email', req.body.email);
     res.redirect('/urls');
  }
});

// Handles user logout =====================================================
app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/urls');
});

// Handles all unknown url/:id =============================================
app.get('*', (req, res) =>{
  res.status(404).send('Page not found')
})

// Listening ===============================================================
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

