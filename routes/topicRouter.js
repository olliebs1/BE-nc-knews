const topicRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topicController.js');

topicRouter.route('/')
  .get(getAllTopics)
  .post(postTopic);

module.exports = topicRouter;
