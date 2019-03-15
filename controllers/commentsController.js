
const { patchCommentById, deleteComment } = require('../models/commentsModel');

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const keys = Object.keys(req.body)
  const values = Object.values(req.body);
  if (inc_votes === undefined) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else if (values !== Number) {
    next(res.status(422).send({ msg: 'Error: Unprocessible Entity' }));
  } else
    patchCommentById(comment_id, inc_votes)
      .then(([updatedComment]) => {
        console.log(updatedComment)
        res.status(202).send({ updatedComment });
      }).catch(err => {
        next(err)
      })
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  const integer = parseInt(comment_id);
  if (typeof (Number(comment_id)) !== 'number') {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else if (isNaN(integer)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    deleteComment(comment_id)
      .then(() => {
        res.status(204).send({});
      }).catch(err => {
        next(err)
      })
  }
};


module.exports = { patchComment, removeComment };
