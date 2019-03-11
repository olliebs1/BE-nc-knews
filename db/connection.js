const knex = require('knex');
const completeConfig = require('../knexfile.js');

const connection = knex(completeConfig);

module.exports = connection;
