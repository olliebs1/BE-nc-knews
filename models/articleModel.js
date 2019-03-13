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
  .orderBy(sort_by || 'articles.created_at', order || 'desc');


const insertArticle = newArticle => connection
  .insert(newArticle)
  .into('articles')
  .returning('*');


const fetchArticlesById = article_id => connection
  .select('articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
  .from('articles')
  .where({
    'articles.article_id': article_id,
  })
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count');


const patchArticleById = (article_id, inc_votes) => connection
  .select('*')
  .from('articles')
  .where({
    'articles.article_id': article_id,
  })
  .increment('votes', inc_votes)
  .returning('*');

const deleteArticle = article_id => connection
  .select('*')
  .from('articles')
  .where({
    'articles.article_id': article_id,
  }).del();


module.exports = {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById, deleteArticle,
};
