import * as puppeteer from 'puppeteer'
import * as _ from 'lodash'

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://sf-iron.truecoach.co/login')

  await page.type('#email', process.env.TRUECOACH_USERNAME)
  await page.type('#password', process.env.TRUECOACH_PASSWORD)

  page.on('response', async response => {
    if (response.url().indexOf('proxy/api/clients/159147/workouts') !== -1) {
      const responseText = await response.text()
      console.log(responseText);
      const workouts = JSON.parse(responseText)
      console.log(workouts);

      _.each(workouts)
    }
  })

  const [loginButton] = await page.$x('//button[contains(., \'Log in\')]')
  await loginButton.click()

  // await browser.close()
})();
