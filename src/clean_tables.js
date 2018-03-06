const { Pool } = require("pg");

async function dropTables() {
  const pool = new Pool();
  await pool.query("DROP TABLE anime_titles;");
  await pool.query("DROP TABLE anime_ranks;");
}

module.exports = { dropTables };
