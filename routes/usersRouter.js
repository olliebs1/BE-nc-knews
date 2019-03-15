const usersRouter = require('express').Router();
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');
const { getUsers, postUser, getUserByUsername } = require('../controllers/usersController');


usersRouter.route('/')
  .get(getUsers)
  .post(postUser)
  .all(methodNotFound)

usersRouter.route('/:username')
  .get(getUserByUsername)
  .all(methodNotFound)

module.exports = usersRouter;
