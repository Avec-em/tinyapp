const express = require ('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs')

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.get('/urls/:shortURL', (req, res) => {
  let templateVar = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render('url_shows', templateVar)
})

//render command will serve the template to index.ejs
//sending back to the browser an html file that has been produced by the template
//start simple and build up - understand from the beginning and what it does

// express.js documentation - returning things to the front end

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
