export const buildBarSeries = (labels, values) =>
  labels.map((label, idx) => ({ label, value: values[idx] || 0 }))

export const cumulativeTotals = (values) => {
  const totals = []
  values.reduce((acc, val, idx) => {
    totals[idx] = acc + val
    return totals[idx]
  }, 0)
  return totals
}
