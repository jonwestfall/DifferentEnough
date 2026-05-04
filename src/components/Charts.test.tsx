import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MeanBars } from './Charts'

describe('MeanBars', () => {
  it('renders independent summary statistics without crashing (regression)', () => {
    const html = renderToStaticMarkup(
      <MeanBars
        data={{
          n1: 30,
          mean1: 82.5,
          sd1: 10.1,
          n2: 28,
          mean2: 76.2,
          sd2: 12.3,
        }}
      />,
    )

    expect(html).toContain('Group A')
    expect(html).toContain('Group B')
    expect(html).toContain('82.5')
    expect(html).toContain('76.2')
  })

  it('renders paired summary statistics as a mean-difference bar', () => {
    const html = renderToStaticMarkup(
      <MeanBars
        data={{
          n: 20,
          meanDiff: -1.75,
          sdDiff: 3.2,
        }}
      />,
    )

    expect(html).toContain('Mean diff')
    expect(html).toContain('-1.8')
  })

  it('renders paired raw values with before/after labels', () => {
    const html = renderToStaticMarkup(
      <MeanBars
        data={{
          before: [10, 11, 12],
          after: [8, 9, 10],
        }}
      />,
    )

    expect(html).toContain('Before')
    expect(html).toContain('After')
  })
})
