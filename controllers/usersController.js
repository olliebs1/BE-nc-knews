const { fetchUsers, createUser, fetchUserByUsername } = require('../models/usersModel');


const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    });
};

const postUser = (req, res, next) => {
  const userPost = req.body;
  createUser(userPost)
    .then(([user]) => {
      res.status(201).send({ user });
    });
};

const getUserByUsername = (req, res, next) => {
  const username = req.params;
  fetchUserByUsername(username)
    .then(([user]) => {
      res.status(200).send({ user });
    });
};


module.exports = { getUsers, postUser, getUserByUsername };
