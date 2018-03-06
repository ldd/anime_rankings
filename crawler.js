const puppeteer = require("puppeteer");
const { insert } = require("./src/update_tables");

const extractAnimeList = async selector => {
  const animeEntries = Array.from(document.querySelectorAll(selector));
  const getValue = el => el.childNodes[0].nodeValue;
  return animeEntries.map(animeEntry => {
    const rank = +getValue(animeEntry.querySelector(".rank>span"));
    const titleInfo = animeEntry.querySelector(".di-ib>.hoverinfo_trigger");
    const title = getValue(titleInfo);
    const id = +titleInfo.id.replace("#area", "");
    const score = +getValue(animeEntry.querySelector(".score>.di-ib>.text"));
    return { id, rank, title, score };
  });
};

(async () => {
  // you need no-sandbox for WSL https://stackoverflow.com/a/47898230
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://myanimelist.net/topanime.php?type=airing");

  const resultsSelector = ".ranking-list";
  await page.waitForSelector(resultsSelector, { visible: true });

  // Extract the results from the page.
  const animeList = await page.evaluate(extractAnimeList, resultsSelector);
  insert(animeList);
  await browser.close();
})();
