const apiRouter = require('express').Router();
const topicRouter = require('../routes/topicRouter');
const articlesRouter = require('../routes/articlesRouter');


apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);


module.exports = apiRouter;
