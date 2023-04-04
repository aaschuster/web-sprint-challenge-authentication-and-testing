/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: "aaron", password: bcrypt.hashSync("pass", 8)},
    {username: "tori", password: bcrypt.hashSync("pass", 8)},
    {username: "mia", password: bcrypt.hashSync("pass", 8)}
  ]);
};
