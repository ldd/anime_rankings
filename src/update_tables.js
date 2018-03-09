const format = require("pg-format");
const { Pool } = require("pg");

async function insertTitles(pool, data = []) {
  const titles = data.map(({ id, title }) => [id, title]);
  const titleQuery =
    "INSERT INTO anime_titles(id, title) VALUES %L ON CONFLICT DO NOTHING";
  await pool.query(format(titleQuery, titles));
}

async function insertRanks(pool, data = []) {
  const now = new Date();
  const ranks = data.map(({ id, score, rank }) => [id, score, rank, now]);
  const rankQuery =
    "INSERT INTO anime_ranks(id, score, rank, date) VALUES %L ON CONFLICT DO NOTHING";
  await pool.query(format(rankQuery, ranks));
}

async function insert(data = []) {
  const pool = new Pool();
  await insertTitles(pool, data);
  await insertRanks(pool, data);
}
module.exports = {
  insert,
  insertTitles,
  insertRanks
};
