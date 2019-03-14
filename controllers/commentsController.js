
const { patchCommentById, deleteComment } = require('../models/commentsModel');

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentById(comment_id, inc_votes)
    .then(([updatedComment]) => {
      res.status(202).send({ updatedComment });
    });
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({});
    });
};


module.exports = { patchComment, removeComment };
