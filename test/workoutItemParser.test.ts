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

test('backoffs -5% x 5 reps x 3 sets', t => {
  const date = '2020-02-18'
  const exercise = '1 Count Pause Bench Press'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• 1@8\n• 5@9\n• -5% x 5 reps x 3 sets\n',
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 1, rpe: '8' },
    { date, exercise, reps: 5, rpe: '9' },
    { date, exercise, reps: 5, rpe: '-5%' },
    { date, exercise, reps: 5, rpe: '-5%' },
    { date, exercise, reps: 5, rpe: '-5%' },
  ]))
})
