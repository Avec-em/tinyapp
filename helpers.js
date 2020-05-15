// Function for checking email/pass ========================================
const checkDuplicates = function(object, value) {
  for (let i of Object.keys(object)) {
    if (object[i]['email'] === value) {
      return true
    }
  }
  return false
};


module.exports = { checkDuplicates };