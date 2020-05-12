const express = require ('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs')

const urlDatabase = {
  "b2xVn2": "http://www.youtube.com",
  "9sm5xK": "http://www.google.com"
};
console.log(urlDatabase)
console.log(urlDatabase.b2xVn2)

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  let templateVar = { urls: urlDatabase };
  res.render('url_index', templateVar);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVar = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('url_shows', templateVar)
})

//render command will serve the template to index.ejs
//sending back to the browser an html file that has been produced by the template
//start simple and build up - understand from the beginning and what it does

// express.js documentation - returning things to the front end

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6)
};

