
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title').notNullable();
    articleTable.string('body', 1000000).notNullable();
    articleTable.integer('votes' || 0);
    articleTable.string('topic').notNullable().references('slug').inTable('topics');
    articleTable.string('author').notNullable().references('username').inTable('users');
    articleTable.timestamp('created_at');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
