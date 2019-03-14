const { fetchUsers } = require('../models/usersModel');


const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    });
};

const postUser = (req, res, next) => {

}


module.exports = { getUsers, postUser };
