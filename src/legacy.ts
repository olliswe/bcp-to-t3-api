import puppeteer from 'puppeteer';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Tabletojson } from 'tabletojson';

export const getBCPData = async (eventUrl: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(eventUrl);
  await page.waitForSelector('.title');
  await page.waitForSelector('select[name="playersTable_length"]');
  await page.select('select[name="playersTable_length"]', '-1');
  const names = await page.evaluate(() => Array.from(document?.querySelectorAll('.title')).map((node) => node.textContent));
  const titles = await page.evaluate(() => Array.from(document?.querySelectorAll('.desc')).map((node) => node.textContent));
  const armiesAndTeam = titles.map((title) => {
    if (!title) {
      return { army: 'unknown', team: 'unknown' };
    }
    const titleArray = title.split('-');
    if (titleArray.length === 0) {
      return { army: 'unknown', team: 'unknown' };
    }
    if (titleArray.length === 2) {
      return { army: titleArray[0].trim(), team: titleArray[1].trim() };
    }
    return { army: titleArray[0].trim(), team: '' };
  });
  const parsedResults = names.map((name, index) => {
    const army = armiesAndTeam[index].army;
    const team = armiesAndTeam[index].team;
    if (!name) {
      return {
        firstName: '',
        lastName: '',
        army,
        team,
      };
    }
    const splitString = name
      .trim()
      .match(/^(\S+)\s(.*)/)
      ?.slice(1);
    if (splitString) {
      return {
        firstName: splitString[0],
        lastName: splitString[1],
        army,
        team,
      };
    }
    return {
      firstName: '',
      lastName: '',
      army,
      team,
    };
  });
  await browser.close();
  return parsedResults;
};

export const getT3PlayerData = async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const htmlString = await axios('https://www.tabletopturniere.de/t3_ntr_search.php', {
    data: `action=list&name=${firstName}&lastname=${lastName}&nickname=%25&gid=3&cid=1&list=2&submit=Suchen`,
    method: 'POST',
  });
  const dom = new JSDOM(htmlString.data);
  const resultTable = dom.window.document.querySelector('table[class="std"]')?.outerHTML;
  if (!resultTable || resultTable.includes('No match found...')) {
    return { success: false };
  }
  const table = Tabletojson.convert(resultTable);
  if (table && table.length > 0) {
    const firstEntry = table[0];
    if (firstEntry && firstEntry.length > 0) {
      const result = firstEntry[0];
      const nickname = result?.Nickname;
      if (nickname) {
        return { success: true, nickname };
      }
    }
  }
  return { success: false };
};
