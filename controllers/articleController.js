const {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById,
} = require('../models/articleModel');


const getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  let authorConditions = {};
  let topicCondition = {};
  let createdCondition = {};

  Object.keys(req.query).forEach((key) => {
    if (key === 'author') {
      authorConditions = { 'articles.author': req.query[key] };
    } else if (key === 'topic') {
      topicCondition = { 'articles.topic': req.query[key] };
    } else if (key === 'created') {
      createdCondition = { 'articles.created_at': req.query[key] };
    }
  });
  fetchAllArticles(authorConditions, topicCondition, createdCondition, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    }).catch((err) => {
      console.log(err);
    });
};

const postArticles = (req, res, next) => {
  const articleToPost = req.body;
  insertArticle(articleToPost)
    .then(([articles]) => {
      res.status(201).send({ articles });
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    });
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(202).send({ updatedArticle });
    }).catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getArticles, postArticles, getArticleById, patchArticle,
};
