import * as puppeteer from 'puppeteer'
import * as _ from 'lodash'

// import * as fs from 'fs'
// const fsPromises = fs.promises;

import * as workoutItemParser from './workoutItemParser'

async function queryTruecoachWorkouts(): Promise<WorkoutsResponse> {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(`https://${process.env.TRUECOACH_GYM}.truecoach.co/login`)

  await page.type('*[data-test="email"]', process.env.TRUECOACH_USERNAME)
  await page.type('*[data-test="password"]', process.env.TRUECOACH_PASSWORD)

  return new Promise(async function (resolve, _reject) {
    page.on('response', async (response) => {
      if (response.url().indexOf('proxy/api/clients/159147/workouts') !== -1) {
        const responseRaw = await response.text()
        resolve(JSON.parse(responseRaw) as WorkoutsResponse)
        await browser.close()
      }
    })

    const [loginButton] = await page.$x("//button[contains(., 'Log in')]")
    await loginButton.click()
  })
}

// async function queryTruecoachWorkouts(): Promise<WorkoutsResponse> {
//   return JSON.parse(await fsPromises.readFile('./sample.json', 'utf8'))
// }

;(async () => {
  const workoutsResponse = await queryTruecoachWorkouts()

  const workouts = workoutsResponse.workouts
  const workoutItems = workoutsResponse.workout_items

  const workoutSets = workoutItemParser.workoutsToSets(workouts, workoutItems)
  _.each(workoutSets, (s) => {
    console.log(`${s.date},${s.exercise},${s.reps},${s.rpe}`)
  })
})()
