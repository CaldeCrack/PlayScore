import type Completion from '../types/Completion'


const meanTime = (completions: Completion[], filter: string) => {
  let filteredList: Completion[] = []
  switch (filter) {
    case 'main':
      filteredList = completions.filter((comp) => comp.main_story)
      break
    case 'extras':
      filteredList = completions.filter((comp) => comp.main_plus_extras)
      break
    case 'completionist':
      filteredList = completions.filter((comp) => comp.completionist)
      break
    default:
      filteredList = []
  }
  if (filteredList.length === 0) return 'N/A'

  let total: number
  switch (filter) {
    case 'main':
      total = filteredList.reduce((sum, item) => sum + item.main_story, 0)
      break
    case 'extras':
      total = filteredList.reduce((sum, item) => sum + item.main_plus_extras!, 0)
      break
    case 'completionist':
      total = filteredList.reduce((sum, item) => sum + item.completionist!, 0)
      break
    default:
      total = 0
  }
  return `${(total / filteredList.length).toFixed(1)}h`
}

const meanAllTimes = (completions: Completion[]) => {
  const allTimes = completions.flatMap(comp => {
    const times: number[] = []

    if (comp.main_story) times.push(comp.main_story)
    if (comp.main_plus_extras) times.push(comp.main_plus_extras)
    if (comp.completionist) times.push(comp.completionist)

    return times
  })

  if (allTimes.length === 0) return 'N/A'

  const total = allTimes.reduce((a, b) => a + b, 0)
  return `${(total / allTimes.length).toFixed(1)}h`
}

export default { meanTime, meanAllTimes }
