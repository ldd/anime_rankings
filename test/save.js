const fs = require("fs");
const { insert } = require("./update_tables");

function readJSON() {
  fs.readFile("data/anime_list.json", async (err, rawData) => {
    if (err) throw err;
    const data = JSON.parse(rawData);
    await insert(data);
  });
}

function saveJSON(data = []) {
  fs.writeFile("data/animeList.json", JSON.stringify(data), { spaces: 2 });
}
module.exports = { readJSON, saveJSON };
