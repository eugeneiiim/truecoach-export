import * as puppeteer from 'puppeteer'

(async (): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://sf-iron.truecoach.co/client/workouts');

  await browser.close();
})();
