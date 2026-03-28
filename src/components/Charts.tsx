import type {
  ContingencyInput,
  CorrelationRawInput,
  IndependentRawInput,
  IndependentSummaryInput,
  PairedRawInput,
  PairedSummaryInput,
} from '../types'

function normalize(values: number[], minPx: number, maxPx: number): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return values.map(() => (minPx + maxPx) / 2)
  return values.map((v) => minPx + ((v - min) / (max - min)) * (maxPx - minPx))
}

type MeanBarsInput = IndependentRawInput | PairedRawInput | IndependentSummaryInput | PairedSummaryInput

export function MeanBars({ data }: { data: MeanBarsInput | null }) {
  if (!data) return null
  let means: number[] = []
  let labels: string[] = []

  if ('groupA' in data) {
    means = [
      data.groupA.reduce((a, b) => a + b, 0) / data.groupA.length,
      data.groupB.reduce((a, b) => a + b, 0) / data.groupB.length,
    ]
    labels = ['Group A', 'Group B']
  } else if ('before' in data) {
    means = [
      data.before.reduce((a, b) => a + b, 0) / data.before.length,
      data.after.reduce((a, b) => a + b, 0) / data.after.length,
    ]
    labels = ['Before', 'After']
  } else if ('mean1' in data) {
    means = [data.mean1, data.mean2]
    labels = ['Group A', 'Group B']
  } else if ('meanDiff' in data) {
    means = [data.meanDiff]
    labels = ['Mean diff']
  }

  if (means.length === 0 || means.some((m) => !Number.isFinite(m))) return null
  const maxAbs = Math.max(...means.map((m) => Math.abs(m)), 1)

  return (
    <div className="mini-chart">
      {means.map((m, i) => (
        <div key={labels[i]} className="bar-block">
          <div className="bar" style={{ height: `${(Math.abs(m) / maxAbs) * 120}px` }} />
          <span>{labels[i]}</span>
          <strong>{m.toFixed(1)}</strong>
        </div>
      ))}
    </div>
  )
}

export function Scatter({ data }: { data: CorrelationRawInput | null }) {
  if (!data) return null
  if (data.x.length < 2) return null
  const x = normalize(data.x, 20, 280)
  const y = normalize(data.y, 180, 20)
  return (
    <svg width="300" height="200" className="scatter">
      <rect x={0} y={0} width={300} height={200} fill="transparent" />
      {x.map((cx, i) => (
        <circle key={`${cx}-${y[i]}`} cx={cx} cy={y[i]} r={4} />
      ))}
    </svg>
  )
}

export function HeatTable({ data }: { data: ContingencyInput | null }) {
  if (!data) return null
  const max = Math.max(...data.counts.flat(), 1)
  return (
    <table className="heat-table">
      <thead>
        <tr>
          <th> </th>
          {data.colLabels.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rowLabels.map((r, ri) => (
          <tr key={r}>
            <th>{r}</th>
            {data.colLabels.map((c, ci) => {
              const val = data.counts[ri][ci]
              const opacity = Math.max(0.15, val / max)
              return (
                <td key={`${r}-${c}`} style={{ background: `rgba(22, 119, 255, ${opacity})` }}>
                  {val}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
