const connection = require('../db/connection.js');


const fetchAllArticles = (authorConditions, topicCondition, createdCondition, sort_by, order) => connection
  .select('articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
  .where(authorConditions)
  .where(topicCondition)
  .where(createdCondition)
  .from('articles')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .orderBy(sort_by || 'articles.created_at', order || 'desc')
  .returning('*');

const insertArticle = newArticle => connection
  .insert(newArticle)
  .into('articles')
  .returning('*');

module.exports = { fetchAllArticles, insertArticle };


// const getAllTreasures = (limit, order, conditions, between) => {
//   return connection.select('treasure_id', 'treasure_name', 'colour', 'age', 'shop_name')
//     .from('treasures')
//     .where(conditions)
//     .whereBetween('age', between.age)
//     .whereBetween('cost_at_auction', between.cost_at_auction)
//     .leftJoin('shops', 'treasures.shop_id', 'shops.shop_id')
//     .groupBy('treasures.treasure_id', 'shops.shop_name')
//     .limit(limit || 25)
//     .orderBy(order || 'cost_at_auction', 'asc');

// }
