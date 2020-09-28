import * as _ from 'lodash'

function tokenize(delim: string, s: string) {
  return s.split(delim).map(s => s.trim())
}

// Ex: 8@9
function parseRepsAndRpe(s: string) {
  const [reps, rpe] = tokenize('@', s)
  return { reps, rpe }
}

// Ex: "2 sets" or "5 reps"
function parseNumSetsOrReps(s: string) {
  return s.split(' ')[0]
}

function processLine(date: string, exercise: string, l: string): WorkoutSet[] {
  if (l === 'Opener') {
    return [{ date, exercise, reps: 1, rpe: 'Opener' }]
  }

  const xCount = (l.match(/x/g) || []).length
  if (xCount === 0) {
    // Ex: 8@9
    const { reps, rpe } = parseRepsAndRpe(l)
    return [{ date, exercise, reps, rpe }]
  } else if (xCount === 1) {
    const lastWord = _.last(l.split(' '))
    if (lastWord === 'reps') {
      // Ex: -5% x 6 reps
      const [rpe, repsStr] = tokenize('x', l)
      return [{ date, exercise, reps: parseNumSetsOrReps(repsStr), rpe }]
    } else if (lastWord === 'sets') {
      // Ex: 8@9 x 2 sets
      const [repsAndRpe, setsStr] = tokenize('x', l)
      const { reps, rpe } = parseRepsAndRpe(repsAndRpe)

      const numSets = parseNumSetsOrReps(setsStr)
      return _.map(_.range(numSets), _i => (
        { date, exercise, rpe, reps }
      ))
    } else {
      throw new Error('unhandled: ' + l)
    }
  } else if (xCount === 2) {
    // Ex: -5% x 4 reps x 2 sets
    const [rpe, repsStr, setsStr] = tokenize('x', l)

    const reps = repsStr.split(' ')[0]
    const numSets = parseNumSetsOrReps(setsStr)
    return _.map(_.range(numSets), _i => (
      { date, exercise, rpe, reps }
    ))
  } else {
    throw new Error('unhandled: ' + l)
  }
}

export function infoToSets(date: string, exercise: string, info: string): WorkoutSet[] {
  const lines = _(info.trim()).split('\n')
    .map(l => l.replace('•', '').trim())
    .value()

  return _.flatMap(lines, l => {
    try {
      return processLine(date, exercise, l)
    } catch (e) {
      console.error(e)
      return []
    }
  })
}

export function workoutsToSets(workouts: Workout[], workoutItems: WorkoutItem[]): WorkoutSet[] {
  const workoutById = _.keyBy(workouts, 'id')

  return _(workoutItems)
    .map((item: WorkoutItem) => {
      const workout = workoutById[item.workout_id]
      return _.extend(item, { date: workout.due })
    })
    .sortBy(['date', 'position'])
    .flatMap(
      (item: WorkoutItem & { date: string }) => infoToSets(item.date, item.name.trim(), item.info)
    )
    .value()
}
