const {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById, deleteArticle, fetchCommentsByArticleId, insertComment, patchCommentById,
} = require('../models/articleModel');
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');


const getArticles = (req, res, next) => {
  const { sort_by, order = 'desc' } = req.query;
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
  if (req.query.order !== 'asc' && req.query.order !== 'desc' && req.query.order !== undefined) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    fetchAllArticles(authorConditions, topicCondition, createdCondition, sort_by, order)

      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const postArticles = (req, res, next) => {
  const articleToPost = req.body;
  insertArticle(articleToPost)
    .then(([articles]) => {
      res.status(201).send({ articles });
    }).catch((err) => {
      next(err);
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

const removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send({});
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    });
};


const postCommentByArticleId = (req, res, next) => {
  const { author, body, votes } = req.body;
  const { article_id } = req.params;
  const comment = { author, body, votes };

  insertComment(comment, article_id)
    .then(([comment]) => {
      res.status(201).send({ comment });
    });
};


module.exports = {
  getArticles, postArticles, getArticleById, patchArticle, removeArticle, getCommentsByArticleId, postCommentByArticleId,
};
