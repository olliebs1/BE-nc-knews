const articlesRouter = require('express').Router();

const { getArticles, postArticles } = require('../controllers/articleController');


articlesRouter.route('/')
  .get(getArticles)
  .post(postArticles);


module.exports = articlesRouter;
