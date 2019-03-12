const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');

const { articleDateTimeStamp, createRef, createArticleIdLink } = require('../utils/utils');

const seed = (knex, promise) => knex.migrate.rollback()
  .then(() => knex.migrate.latest())
  .then(() => knex.insert(userData).into('users').returning('*'))
  .then(() => knex.insert(topicData).into('topics').returning('*'))
  .then(() => {
    const formattedArticleData = articleDateTimeStamp(articleData);
    return knex.insert(formattedArticleData).into('articles').returning('*');
  })
  .then((formattedArticleData) => {
    const refObj = createRef(formattedArticleData);
    return refObj;
  })
  .then((refObj) => {
    const formattedComments = createArticleIdLink(commentData, refObj);
    return knex.insert(formattedComments).into('comments').returning('*');
  });


module.exports = { seed };
