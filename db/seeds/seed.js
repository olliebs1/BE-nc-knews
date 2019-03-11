const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');

const seed = (knex, promise) => {
  return knex.migrate.rollback().then(() => knex.migrate.latest()).then(() => {
    return knex.insert(userData).into('users').returning('*');
  })
    .then(() => {
      return knex.insert(topicData).into('topics').returning('*');
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        const date = new Date(article.created_at);
        return {
          title: article.title,
          body: article.body,
          votes: article.votes || 0,
          topic: article.topic,
          author: article.author,
          created_at: date,
        };
      });
      return knex.insert(formattedArticleData).into('articles').returning('*');
    })
    .then(() => {
      const formattedCommentData = commentData.map((comment) => {
        const date = new Date(comment.created_at);
        return {
          author: comment.author,
          article_id: comment.article_id,
          votes: comment.votes || 0,
          created_at: date,
          body: comment.body,
        };
      });
      return knex.insert(formattedCommentData).into('comments').returning('*');
    });
};

module.exports = { seed };