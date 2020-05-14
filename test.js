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

if (urlDatabase['htys90']['user_id'] === 'aJ48lW') {
  console.log('ya')
}

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

const urlDB = function(object, user_id) {
  for (let i of Object.keys(object)) {
    if(object[i]['user_id'] === user_id)
    console.log(object[i]['user_id'])
    }
}


  //urlDB(urlDatabase)
