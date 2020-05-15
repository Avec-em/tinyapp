// Function for checking email/pass ========================================
const checkDuplicates = function(object, key, value) {
  for (let i of Object.keys(object)) {
    if (object[i][key] === value) {
      return true
    }
  }
  return false
};


module.exports = { checkDuplicates };