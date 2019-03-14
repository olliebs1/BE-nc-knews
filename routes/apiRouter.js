const apiRouter = require('express').Router();
const topicRouter = require('../routes/topicRouter');
const articlesRouter = require('../routes/articlesRouter');
const commentsRouter = require('../routes/commentsRouter');


apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
