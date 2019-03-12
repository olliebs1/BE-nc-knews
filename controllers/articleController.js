const { fetchAllArticles, insertArticle } = require('../models/articleModel');

const getArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    });
};

const postArticles = (req, res, next) => {
  const articleToPost = req.body;
  insertArticle(articleToPost)
    .then(([articles]) => {
      res.status(201).send({ articles });
    });
};

module.exports = { getArticles, postArticles };
