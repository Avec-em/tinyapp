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

const emailDupilcates = function(object, key, email) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === email) {
      return true
    }
  }
  return false
};


console.log(emailDupilcates(usersDatabase, 'email', 'user2@example.com'))
