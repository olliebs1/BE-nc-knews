
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').notNullable().references('username').inTable('users');
    commentsTable.integer('article_id').references('article_id').inTable('articles').onDelete('cascade');
    commentsTable.integer('votes' || 0).notNullable();
    commentsTable.string('body', 100000).notNullable();
    commentsTable.timestamp('created_at');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
