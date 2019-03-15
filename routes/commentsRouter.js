const commentsRouter = require('express').Router();
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');
const { patchComment, removeComment } = require('../controllers/commentsController');

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(removeComment)
  .all(methodNotFound);


module.exports = commentsRouter;
