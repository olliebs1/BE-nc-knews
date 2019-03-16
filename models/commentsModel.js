const connection = require('../db/connection.js');

const patchCommentById = (comment_id, inc_votes) => connection
  .from('comments')
  .where({
    'comments.comment_id': comment_id,
  })
  .increment('votes', inc_votes)
  .returning('*');

const deleteComment = comment_id => connection
  .from('comments')
  .where({
    'comments.comment_id': comment_id,
  })
  .del();


module.exports = { patchCommentById, deleteComment };
