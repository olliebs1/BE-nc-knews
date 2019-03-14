const commentsRouter = require('express').Router();

const { patchComment, removeComment } = require('../controllers/commentsController');

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(removeComment);


module.exports = commentsRouter;
