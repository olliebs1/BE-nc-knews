const connection = require('../db/connection.js');


const fetchAllArticles = () => connection
  .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
  .from('articles')
  .join('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id', 'comments.comment_id')
  .count('comments as comment_count');

const insertArticle = newArticle => connection
  .insert(newArticle)
  .into('articles')
  .returning('*');

module.exports = { fetchAllArticles, insertArticle };
