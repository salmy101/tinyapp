const { assert } = require('chai');

const { getUserEmail } = require('../helpers');

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


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert(user.id === expectedUserID)

  });
});
describe('getUserByEmail', function() {
  it('should return undefined with invalid email', function() {
    const user = getUserEmail("a@e.com", testUsers)
    const expectedUserID = undefined;
    assert(user === expectedUserID)

  });
});