const { fetchAllTopics, insertTopic } = require('../models/topicModel');
const {
  error400, RouteNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    });
};

const postTopic = (req, res, next) => {
  const topicToPost = req.body;
  insertTopic(topicToPost)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllTopics, postTopic };
