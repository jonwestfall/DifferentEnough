import { describe, expect, it } from 'vitest'
import { parseSavedAnalysis } from './exportImport'

describe('parseSavedAnalysis', () => {
  it('parses a valid saved analysis payload', () => {
    const text = JSON.stringify({
      app: 'Different Enough?',
      version: 1,
      savedAt: '2026-03-28T18:00:00.000Z',
      test: 'correlation',
      inputMethod: 'summary',
      payload: { n: 42, r: 0.4 },
      result: {
        test: 'correlation',
        plainLanguage: 'text',
        formalResult: 'text',
        apa: 'text',
        pValue: 0.01,
        significant: true,
        alpha: 0.05,
        descriptives: [],
        effectSize: { name: 'r', value: 0.4, formatted: '0.40', interpretation: 'moderate' },
        warnings: { assumptions: [], sample: [], missingData: [], interpretation: [] },
        trust: { summary: 'ok', bullets: [], riskLevel: 'low' },
        deepExplanation: [],
      },
    })

    const parsed = parseSavedAnalysis(text)

    expect(parsed.app).toBe('Different Enough?')
    expect(parsed.version).toBe(1)
    expect(parsed.test).toBe('correlation')
  })

  it('throws on incompatible exports', () => {
    const badText = JSON.stringify({
      app: 'Something Else',
      version: 2,
    })

    expect(() => parseSavedAnalysis(badText)).toThrow(/does not look like a Different Enough\? export/i)
  })
})
