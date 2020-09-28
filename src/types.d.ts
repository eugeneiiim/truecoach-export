interface Workout {
  id: number
  due: string
  // workout_item_ids: number[]
}

interface WorkoutItem {
  name: string
  info: string
  workout_id: number
  position: number
}

interface WorkoutsResponse {
  workouts: Workout[]
  workout_items: WorkoutItem[]
}

interface WorkoutSet {
  date: string
  exercise: string
  reps: string
  rpe: string
}
