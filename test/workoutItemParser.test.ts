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

test('backoffs -5% x 6 reps', t => {
  const date = '2020-02-25'
  const exercise = 'Pin bench at chest height'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• 6@7\n• 6@8\n• 6@9\n• -5% x 6 reps\n'
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 6, rpe: '7' },
    { date, exercise, reps: 6, rpe: '8' },
    { date, exercise, reps: 6, rpe: '9' },
    { date, exercise, reps: 6, rpe: '-5%' },
  ]))
})

test('opener', t => {
  const date = '2020-03-19'
  const exercise = '1 Count Pause Bench Press'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '• Opener\n'
  )

  t.true(_.isEqual(sets, [
    { date, exercise, reps: 1, rpe: 'Opener' },
  ]))
})

test('ignores invalid line', t => {
  const date = '2020-03-19'
  const exercise = '1 Count Pause Bench Press'

  const sets = workoutItemParser.infoToSets(
    date,
    exercise,
    '15-20 reps @8 on first set x 3 total\n'
  )

  t.true(_.isEqual(sets, []))
})