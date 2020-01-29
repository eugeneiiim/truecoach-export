import * as _ from 'lodash'

export function infoToSets(date: string, exercise: string, info: string): WorkoutSet[] {
  const lines = _(info).split('\n')
    .map(l => l.replace('•', '').trim())
    .value()

  const sets = _(lines).slice(0, lines.length - 1).map(l => {
    const [reps, rpe] = l.split('@')
    return {
      date,
      exercise,
      reps: parseInt(reps),
      rpe,
    }
  }).value()

  const backoffsLine = lines[lines.length - 1]

  // Ex: -5% x 4 reps x 2 sets
  const [rpe, repsStr, setsStr] =
    _(backoffsLine).split('x').map(s => s.trim()).value()

  const reps = parseInt(repsStr.split(' ')[0])
  const numSets = parseInt(setsStr.split(' ')[0])

  const backoffSets = _.map(_.range(numSets), _i => ({
    date,
    exercise,
    rpe,
    reps
  }))

  return sets.concat(backoffSets)
}
