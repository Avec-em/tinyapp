const { assert } = require('chai');

const { checkDuplicates } = require('./helpers.js');

const testUsers = {
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

describe('checkDuplicates', function() {
  it('should return true as user@example is in database', function() {
    const user = checkDuplicates(testUsers, "user@example.com")
    const expectedOutput = true;
    assert(user === expectedOutput, "true is = to true");
  });
  it('should return false as Monkey@example is not in database', function() {
    const user = checkDuplicates(testUsers, "monkey@example.com")
    const expectedOutput = false;
    assert(user === expectedOutput, "false is = false");
  });
});