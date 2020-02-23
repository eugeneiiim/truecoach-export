import * as _ from 'lodash'

// Ex: 8@9
function parseRepsAndRpe(s: string) {
  const [reps, rpe] = s.split('@')
  return {
    reps: parseInt(reps),
    rpe
  }
}

// Ex: "2 sets" or "5 reps"
function parseNumSetsOrReps(s: string) {
  return parseInt(s.split(' ')[0])
}

export function infoToSets(date: string, exercise: string, info: string): WorkoutSet[] {
  const lines = _(info.trim()).split('\n')
    .map(l => l.replace('•', '').trim())
    .value()

  return _.flatMap(lines, l => {
    const xCount = (l.match(/x/g) || []).length
    if (xCount === 0) {
      // Ex: 8@9
      const { reps, rpe } = parseRepsAndRpe(l)
      return [{ date, exercise, reps, rpe }]
    } else if (xCount === 1) {
      const lastWord = _.last(l.split(' '))
      if (lastWord === 'reps') {
        // Ex: -5% x 6 reps
        const [rpe, repsStr] = _(l).split('x').map(s => s.trim()).value()
        return [{ date, exercise, reps: parseNumSetsOrReps(repsStr), rpe }]
      } else if (lastWord === 'sets') {
        // Ex: 8@9 x 2 sets
        const [repsAndRpe, setsStr] = _(l).split('x').map(s => s.trim()).value()
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
      const [rpe, repsStr, setsStr] =
        _(l).split('x').map(s => s.trim()).value()

      const reps = parseInt(repsStr.split(' ')[0])
      const numSets = parseNumSetsOrReps(setsStr)
      return _.map(_.range(numSets), _i => (
        { date, exercise, rpe, reps }
      ))
    } else {
      throw new Error('unhandled: ' + l)
    }
  })
}
