const { Pool } = require("pg");

const createTableTitles = `
CREATE TABLE anime_titles(
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) not null
);
`;

const createTableRanks = `
CREATE TABLE anime_ranks(
  id SERIAL,
  score NUMERIC(4,2),
  rank int2,
  date DATE,
  FOREIGN KEY (id) REFERENCES  anime_titles(id)
);
`;

async function createTables() {
  const pool = new Pool();
  await pool.query(createTableTitles);
  await pool.query(createTableRanks);
}

module.exports = {
  createTables
};
