export const formatScore = (score) =>
  score === null || score === undefined ? '-' : `${score}`

export const formatPercentage = (value, digits = 0) =>
  `${(value * 100).toFixed(digits)}%`
