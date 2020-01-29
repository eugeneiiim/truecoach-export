import anyTest, { TestInterface } from 'ava'
import * as _ from 'lodash'

const test = anyTest as TestInterface<{}>

import * as workoutItemParser from '../src/workoutItemParser'

test('backoffs - -5% x 4 reps x 2 sets', t => {
  const date = '2020-01-28'
  const exercise = 'deadlifts'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• 4@6\n• 4@7\n• 4@8\n• -5% x 4 reps x 2 sets'
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 4, rpe: '6' },
    { date, exercise, reps: 4, rpe: '7' },
    { date, exercise, reps: 4, rpe: '8' },
    { date, exercise, reps: 4, rpe: '-5%' },
    { date, exercise, reps: 4, rpe: '-5%' },
  ]))
})

test('backoffs - 8@9 x 2 sets', t => {
  const date = '2020-01-30'
  const exercise = 'belt squat'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• 8@7\n• 8@8\n• 8@9 x 2 sets',
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 8, rpe: '7' },
    { date, exercise, reps: 8, rpe: '8' },
    { date, exercise, reps: 8, rpe: '9' },
    { date, exercise, reps: 8, rpe: '9' },
  ]))
})

test('no backoffs', t => {
  const date = '2020-01-30'
  const exercise = 'belt squat'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• 8@7\n• 8@8\n• 8@9',
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 8, rpe: '7' },
    { date, exercise, reps: 8, rpe: '8' },
    { date, exercise, reps: 8, rpe: '9' },
  ]))
})
