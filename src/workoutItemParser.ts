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
      rpe: rpe,
    }
  }).value()

  const lastLine = lines[lines.length - 1]
  console.log(lastLine);

  return sets
}
