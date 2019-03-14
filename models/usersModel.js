const connection = require('../db/connection.js');


const fetchUsers = () => connection
  .select('*')
  .from('users');


const createUser = () => connection
  .insert


module.exports = { fetchUsers, createUser };
