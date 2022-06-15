interface Interval {
  label: string
  seconds: number
}
const intervals: Interval[] = [
  { label: 'year', seconds: 31536000 },
  { label: 'M', seconds: 2592000 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
  { label: 's', seconds: 1 },
]

function timeSince(sourceDate: string | number) {
  const date = new Date(sourceDate)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const interval = intervals.find((i) => i.seconds < seconds)
  const count = interval ? Math.floor(seconds / interval.seconds) : 0
  return `${count}${interval?.label || ''} ago`
}
export const DateService = {
  timeSince,
}
