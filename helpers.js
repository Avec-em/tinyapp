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

// Function for checking email/pass ========================================
const checkDuplicates = function(object, value) {
  for (let i of Object.keys(object)) {
    if (object[i]['email'] === value) {
      return true;
    }
  }
  return false;
};

module.exports = { checkDuplicates };