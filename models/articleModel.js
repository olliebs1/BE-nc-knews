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
  .orderBy(sort_by || 'articles.created_at', order || 'asc');


const insertArticle = articlePost => connection
  .insert(articlePost)
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


const fetchCommentsByArticleId = (article_id, sort_by, order) => connection
  .select('comment_id', 'votes', 'created_at', 'author', 'body')
  .from('comments')
  .where({
    'comments.article_id': article_id,
  })
  .orderBy(sort_by || 'comments.created_at', order || 'desc');


const insertComment = (comment, article_id) => connection
  .insert(comment)
  .into('comments')
  .where({ 'comments.article_id': article_id })
  .returning('*');


module.exports = {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById, deleteArticle, fetchCommentsByArticleId, insertComment,
};
