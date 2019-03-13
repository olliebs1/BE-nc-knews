const articlesRouter = require('express').Router();

const {
  getArticles, postArticles, getArticleById, patchArticle,
} = require('../controllers/articleController');


articlesRouter.route('/')
  .get(getArticles)
  .post(postArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle);


module.exports = articlesRouter;
