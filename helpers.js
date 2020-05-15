// URL Database ============================================================
const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    user_id: '6741j2'
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    user_id: '4iddg5'
  },
  htys90: {
    longURL: 'https://www.aritzia.com',
    user_id: '4iddg5'
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

// Function for checking email/pass ========================================
const checkDuplicates = function(object, value) {
  for (let i of Object.keys(object)) {
    if (object[i]['email'] === value) {
      return true;
    }
  }
  return false;
};

// Function for generating random string ===================================
const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};

const findUserPass = function(object, email) {
  for (let i of Object.keys(object)) {
    if (object[i]['email'] === email) {
      return object[i]['password'];
    }
  }
};

// Function for filtering URLS =============================================
const filterURL = function(uId) {
  let filtered = {};
  for (let url in urlDatabase) {
    if ((urlDatabase[url]['user_id']) === uId)
      filtered[url] = urlDatabase[url];
  }
  return filtered;
};

// Function for finding userID =============================================
const findUserID = function(object, key, email) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === email) {
      return object[i]['id'];
    }
  }
};

module.exports = { 
  checkDuplicates,
  generateRandomString,
  findUserPass,
  findUserID
};