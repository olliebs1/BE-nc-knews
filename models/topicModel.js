const connection = require('../db/connection.js');

const fetchAllTopics = () => connection
  .select('*')
  .from('topics');

const insertTopic = newTopic => connection
  .insert(newTopic)
  .into('topics')
  .returning('*');


module.exports = { fetchAllTopics, insertTopic };
