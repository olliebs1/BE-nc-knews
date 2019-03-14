const connection = require('../db/connection.js');


const fetchUsers = () => connection
  .select('*')
  .from('users');


const createUser = userPost => connection
  .insert(userPost)
  .into('users')
  .returning('*');


const fetchUserByUsername = username => connection
  .from('users')
  .where(username)
  .returning('*');


module.exports = { fetchUsers, createUser, fetchUserByUsername };
