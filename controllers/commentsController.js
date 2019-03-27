
const { patchCommentById, deleteComment } = require('../models/commentsModel');

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const values = Object.values(req.body);
  if (inc_votes === undefined || isNaN(values)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    patchCommentById(comment_id, inc_votes)
      .then(([updatedComment]) => {
        if (updatedComment === undefined) {
          res.status(404).send({ msg: 'Error: Route Not Found' });
        } else res.status(200).send({ updatedComment });
      }).catch((err) => {
        next(err);
      });
  }
};
// write test to check to see if i get a 404 for a comment id that doesnt exist
const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  const integer = parseInt(comment_id);
  if (typeof (Number(comment_id)) !== 'number') {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else if (isNaN(integer)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    deleteComment(comment_id)
      .then((deleteCount) => {
        if (deleteCount === 0) {
          next(res.status(404).send({ msg: 'Error: Route Not Found' }));
        } else res.status(204).send({});
      }).catch((err) => {
        next(err);
      });
  }
};


module.exports = { patchComment, removeComment };
