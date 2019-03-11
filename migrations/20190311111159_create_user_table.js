exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (userTable) => {
    userTable
      .string('username', 100)
      .primary()
      .notNullable();
    userTable.string('avatar_url').notNullable();
    userTable.string('name', 100).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
