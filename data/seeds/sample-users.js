/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: "aaron", password: "pass"},
    {username: "tori", password: "pass"},
    {username: "mia", password: "pass"}
  ]);
};
