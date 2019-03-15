const { fetchUsers, createUser, fetchUserByUsername } = require('../models/usersModel');


const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    }).catch((err) => {
      next(err);
    });
};

const postUser = (req, res, next) => {
  const userPost = req.body;
  createUser(userPost)
    .then(([user]) => {
      res.status(201).send({ user });
    }).catch((err) => {
      next(err);
    });
};

const getUserByUsername = (req, res, next) => {
  const username = req.params;
  fetchUserByUsername(username)
    .then(([user]) => {
      if (user === undefined) {
        next(res.status(404).send({ msg: 'Error: Route Not Found' }));
      } else res.status(200).send({ user });
    }).catch((err) => {
      next(err);
    });
};


module.exports = { getUsers, postUser, getUserByUsername };
