const { fetchAllTopics, insertTopic } = require('../models/topicModel');


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
    });
};

module.exports = { getAllTopics, postTopic };
