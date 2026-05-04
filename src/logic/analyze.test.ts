import { describe, expect, it } from 'vitest'
import { analyze } from './analyze'

describe('analyze orchestration', () => {
  it('handles independent t-test from summary statistics', () => {
    const payload = {
      n1: 30,
      mean1: 82,
      sd1: 10,
      n2: 28,
      mean2: 76,
      sd2: 12,
    }

    const out = analyze('independent_t', payload)

    expect(out.test).toBe('independent_t')
    expect(out.effectSize.name).toBe("Hedges' g")
    expect(out.descriptives.find((d) => d.label === 'n group A')?.value).toBe('30')
    expect(out.chartData).toEqual(payload)
  })

  it('handles paired t-test from summary statistics', () => {
    const payload = {
      n: 24,
      meanDiff: 2.1,
      sdDiff: 4.3,
    }

    const out = analyze('paired_t', payload)

    expect(out.test).toBe('paired_t')
    expect(out.effectSize.name).toBe('Paired Cohen dz')
    expect(out.descriptives.find((d) => d.label === 'n pairs')?.value).toBe('24')
    expect(out.chartData).toEqual(payload)
  })

  it('returns chi-square independence with Phi label for 2x2 tables', () => {
    const payload = {
      rowLabels: ['A', 'B'],
      colLabels: ['Yes', 'No'],
      counts: [
        [30, 10],
        [12, 28],
      ],
    }

    const out = analyze('chi_independence', payload)

    expect(out.test).toBe('chi_independence')
    expect(out.effectSize.name).toBe('Phi')
    expect(out.pValue).toBeLessThan(0.05)
  })

  it('handles chi-square goodness-of-fit payloads', () => {
    const payload = {
      categories: ['Red', 'Blue', 'Green'],
      observed: [40, 35, 25],
    }

    const out = analyze('chi_gof', payload)

    expect(out.test).toBe('chi_gof')
    expect(out.effectSize.name).toBe("Cohen's w")
    expect(out.descriptives.find((d) => d.label === 'Total n')?.value).toBe('100')
  })

  it('handles correlation from summary statistics', () => {
    const payload = {
      n: 64,
      r: 0.42,
    }

    const out = analyze('correlation', payload)

    expect(out.test).toBe('correlation')
    expect(out.effectSize.name).toBe('r')
    expect(out.descriptives.find((d) => d.label === 'n')?.value).toBe('64')
    expect(out.confidenceInterval).toBeDefined()
  })
})
