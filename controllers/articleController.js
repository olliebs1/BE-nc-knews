const {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById, deleteArticle, fetchCommentsByArticleId, insertComment, patchCommentById,
} = require('../models/articleModel');
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');


const getArticles = (req, res, next) => {
  const { sort_by, order = 'desc' } = req.query;
  // const values = Object.values(req.query);
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
  const article_id = req.params;
  insertArticle(articleToPost)
    .then(([articles]) => {
      res.status(201).send({ articles });
    }).catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (article_id !== Number && article_id > 100) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    fetchArticlesById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      }).catch((err) => {
        next(err);
      });
  }
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const values = Object.values(req.body)
  const keys = Object.keys(req.body);
  if (req.body > 1) {
    next(res.status(422).send({ msg: 'Error: Unprocessible Entity' }))
  } else
    if (keys[0] != 'inc_votes' && keys[0] !== undefined) {
      next(res.status(400).send({ msg: 'Error: Bad Request' }));
    } else if (values !== Number) {
      next(res.status(422).send({ msg: 'Error: Unprocessible Entity' }))
    } else
      patchArticleById(article_id, inc_votes)
        .then((updatedArticle) => {
          res.status(202).send({ updatedArticle });
        }).catch((err) => {
          next(err);
        });
}


const removeArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (article_id !== Number && article_id > 100) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }))
  } else
    deleteArticle(article_id)
      .then(() => {
        res.status(204).send({});
      }).catch(err => {
        next(err)
      })
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
