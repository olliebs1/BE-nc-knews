const connection = require('../db/connection.js');

const patchCommentById = (comment_id, inc_votes) => connection
  .select('*')
  .from('comments')
  .where({
    'comments.comment_id': comment_id,
  })
  .increment('votes', inc_votes)
  .returning('*');

const deleteComment = comment_id => connection
  .select('*')
  .from('comments')
  .where({
    'comments.comment_id': comment_id,
  })
  .del();


// const deleteArticle = article_id => connection
//   .select('*')
//   .from('articles')
//   .where({
//     'articles.article_id': article_id,
//   }).del();


module.exports = { patchCommentById, deleteComment };
