const apiRouter = require('express').Router();
const topicRouter = require('../routes/topicRouter');
const articlesRouter = require('../routes/articlesRouter');
const commentsRouter = require('../routes/commentsRouter');
const usersRouter = require('../routes/usersRouter');
const { getApi } = require('../controllers/apiController');

apiRouter.get('/getApi', getApi);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
