import * as puppeteer from 'puppeteer'
import * as _ from 'lodash'

interface Workout {
  id: number
  due: string
  workout_item_ids: number[]
}

interface WorkoutItem {
  name: string
  info: string
  workout_id: number
}

interface WorkoutsResponse {
  workouts: Workout[]
  workout_items: WorkoutItem[]
}

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://sf-iron.truecoach.co/login')

  await page.type('#email', process.env.TRUECOACH_USERNAME)
  await page.type('#password', process.env.TRUECOACH_PASSWORD)

  page.on('response', async response => {
    if (response.url().indexOf('proxy/api/clients/159147/workouts') !== -1) {
      const workoutsResponse = JSON.parse(await response.text()) as WorkoutsResponse
      const workouts = workoutsResponse.workouts
      const workoutItems = workoutsResponse.workout_items

      _.each(workouts, (workout: Workout) => {
        console.log(workout.id);
        console.log(workout.due);
        console.log(workout.workout_item_ids);
      })

      _.each(workoutItems, (workoutItem: WorkoutItem) => {
        console.log(workoutItem.workout_id);
        console.log(workoutItem.name);
        console.log(workoutItem.info);
      })
    }
  })

  const [loginButton] = await page.$x('//button[contains(., \'Log in\')]')
  await loginButton.click()

  // await browser.close()
})();
