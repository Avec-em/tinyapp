// TinyApp Dependancies

const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// Function for generating random string ======================
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};

// function for looping through usersDatabase
const checkDuplicates = function(object, key, value) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === value) {
      return true
    }
  }
  return false
};

// function for looping through urlDatabse
const urlDB = function(object, key, value) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === value) {
      return true
    }
  }
  return false
};


// function for filtering URLS ================================
const filterURL = function(uId) {
  let filtered = {};
  for (let url in urlDatabase) {
    if ((urlDatabase[url]['user_id']) === uId)
    filtered[url] = urlDatabase[url]
  }
  return filtered
}


// function for finding userID =================================
const findUser = function (object, key, email) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === email) {
      return object[i]['id']
    }
  }
};

// URL Database ================================================
const urlDatabase = {
  b6UTxQ: { 
    longURL: "https://www.tsn.ca", 
    user_id: "userRandomID" 
  },
  i3BoGr: { 
    longURL: "https://www.google.ca", 
    user_id: "aJ48lW" 
  },
  htys90: {
    longURL: "https://www.aritzia.com",
    user_id: "aJ48lW"
  }
};

// Users Database ===============================================
const usersDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "emilymnicholas@gmail.com",
    password: "123"
  }
};



//URLS JSON
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//serves show all url page
app.get('/urls', (req, res) => {
  const { user_id } = req.cookies;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
    let templateVar = {
      urls: filterURL(user_id),
      users: usersDatabase,
      user_id: req.cookies.user_id,
    };
    res.render('url_index', templateVar);
  } else {
    res.send('Please <a href="/login">Log in</a> or <a href="/Register">Register</a>')
  }
});

//serves create url page
app.get("/urls/new", (req, res) => {
  const { user_id } = req.cookies;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
    let templateVar = {
      user_id: req.cookies.user_id,
      users: usersDatabase,
    };
    res.render("urls_new", templateVar);
  } else {
    res.redirect('/login')
  }
});

//serves showurl with shortURL
app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]['user_id'] === req.cookies.user_id){
  let templateVar = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user_id: req.cookies.user_id,
    users: usersDatabase,
  };
  res.render('url_shows', templateVar);
} else {
  res.send('You are only able to view URL\'s that belong to you')
}
});

// serves urlshow and creates shortURL link which leads to longURL
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

//handles the creation of a new url and adds it to the url Database
app.post("/urls", (req, res) => {
  let shorty = generateRandomString();
  urlDatabase[shorty] = {
    longURL: req.body.longURL,
    user_id: req.cookies.user_id,
  };
  console.log(urlDatabase)
  res.redirect(`/urls/${shorty}`);
});

// handles the delete request from client
app.post('/urls/:shortURL/delete', (req, res) => {
  const { user_id } = req.cookies;
  if(user_id in usersDatabase) {
    const loggedInUser = usersDatabase[user_id];
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
  } else {
    res.send('not allowed to delete URL\'s that are not yours')
  }
});

// handles the edit request from client and updates the url Database
app.post('/urls/:shortURL/update', (req, res) => {
  const { user_id } = req.cookies;
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

//serves register page when requested
app.get('/register', (req, res) => {
  let templateVar = {
    user_id: req.cookies.user_id,
    users: usersDatabase,
  };
  res.render('user_reg', templateVar);
});

//serves user registration page and adds user to the database
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === ''){
    console.log('yes, this condition was met');
    res.status(400).send('Please enter both email and password')
  } 
  else if (checkDuplicates(usersDatabase, 'email', req.body.email)) { 
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
    res.cookie('user_id', `${shorty}`);
    res.redirect('/urls');
  }
}); 

//handles the login from client
app.post('/login', (req, res) => {
  if (req.body.email === '' || req.body.password === ''){
    res.status(400).send('Please enter both email and password')
  } 
  else if (!checkDuplicates(usersDatabase, 'email', req.body.email)) { 
    res.status(400).send('Email not registered')
  } 
  else if (!checkDuplicates(usersDatabase, 'password', req.body.password)) {
    res.status(400).send('Password not found, please try again')
  }
   else  {
     //
    res.cookie('user_id', findUser(usersDatabase, 'email', req.body.email));
    //change function name to findUserID
    res.redirect('/urls');
  }
});

//serves login page
app.get('/login', (req, res) => {
  let templateVar = {
    user_id: req.cookies.user_id,
    users: usersDatabase,
  };
  res.render('loginPage', templateVar);
})

//handles the logout from client
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('*', (req, res) =>{
  res.status(404).send('Page not found')
})

// listening at port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


//remove email cookie - get from userDatabase from user_id