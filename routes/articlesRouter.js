const articlesRouter = require('express').Router();


const {
  getArticles,
  postArticles,
  getArticleById,
  patchArticle,
  removeArticle,
  getCommentsByArticleId,
} = require('../controllers/articleController');


articlesRouter.route('/')
  .get(getArticles)
  .post(postArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(removeArticle);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId);
// .post(postCommentByArticleId);


module.exports = articlesRouter;
