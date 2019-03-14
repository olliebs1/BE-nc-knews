const articlesRouter = require('express').Router();
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');


const {
  getArticles,
  postArticles,
  getArticleById,
  patchArticle,
  removeArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/articleController');


articlesRouter.use('/bad-route', routeNotFound);

articlesRouter.route('/')
  .get(getArticles)
  .post(postArticles)
  .all(methodNotFound);


articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(removeArticle)
  .all(methodNotFound);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotFound);


module.exports = articlesRouter;
