const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return true;
}

//Function to check if the user is authenticated
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const cur_user = req.session.authorization.username;
  const isbn = req.params.isbn;
  books[isbn].reviews[cur_user] = req.query.review;

  return res.status(200).send("The review for book with isbn "+isbn+" has been added/updated");

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const cur_user = req.session.authorization.username;
  const isbn = req.params.isbn;

  delete books[isbn].reviews[cur_user];

  return res.status(200).send("The review for book with isbn "+isbn+ " for user "+cur_user+
                              " has been deleted");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
