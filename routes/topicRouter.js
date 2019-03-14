const topicRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topicController.js');
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('../errors/errors.js');


topicRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(methodNotFound);


module.exports = topicRouter;
