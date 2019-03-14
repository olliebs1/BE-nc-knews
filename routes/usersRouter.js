const usersRouter = require('express').Router();

const { getUsers, postUser, getUserByUsername } = require('../controllers/usersController');


usersRouter.route('/')
  .get(getUsers)
  .post(postUser);

usersRouter.route('/:username')
  .get(getUserByUsername);

module.exports = usersRouter;
