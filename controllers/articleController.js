const {
  fetchAllArticles, insertArticle, fetchArticlesById, patchArticleById, deleteArticle, fetchCommentsByArticleId, insertComment, patchCommentById,
} = require('../models/articleModel');


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
  if (typeof (Number(article_id)) !== 'number') {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    fetchArticlesById(article_id)
      .then((article) => {
        if (article.length === 0) {
          next(res.status(404).send({ msg: 'Error: Route Not Found' }));
        } else {
          res.status(200).send({ article });
        }
      }).catch((err) => {
        next(err);
      });
  }
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const values = Object.values(req.body);
  if (isNaN(values)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    patchArticleById(article_id, inc_votes)
      .then((updatedArticle) => {
        res.status(200).send({ updatedArticle });
      }).catch((err) => {
        next(err);
      });
  }
};


const removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  const integer = parseInt(article_id);
  if (typeof (Number(article_id)) !== 'number') {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else if (isNaN(integer)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    deleteArticle(article_id)
      .then((deleteCount) => {
        if (deleteCount === 0) {
          next(res.status(404).send({ msg: 'Error: Route Not Found' }));
        } else res.sendStatus(204);
      }).catch((err) => {
        next(err);
      });
  }
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const integer = parseInt(article_id);
  if (isNaN(integer)) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    fetchCommentsByArticleId(integer, sort_by, order)
      .then((comments) => {
        if (comments.length === 0) {
          next(res.status(400).send({ msg: 'Error: Bad Request' }));
        } else {
          res.status(200).send({ comments });
        }
      }).catch((err) => {
        console.log(err);
      });
  }
};


const postCommentByArticleId = (req, res, next) => {
  const { author, body, votes } = req.body;
  const { article_id } = req.params;
  const comment = { author, body, votes };
  const integer = parseInt(article_id);
  if (isNaN(integer) || integer > 100) {
    next(res.status(400).send({ msg: 'Error: Bad Request' }));
  } else {
    insertComment(comment, article_id)
      .then(([comment]) => {
        res.status(201).send({ comment });
      }).catch((err) => {
        next(err);
      });
  }
};


module.exports = {
  getArticles, postArticles, getArticleById, patchArticle, removeArticle, getCommentsByArticleId, postCommentByArticleId,
};
