import { describe, expect, it } from 'vitest'
import { listwiseExclude } from './missing'

describe('listwiseExclude', () => {
  it('drops rows missing any required field and reports counts', () => {
    const rows = [
      { group: 'A', value: 10 },
      { group: 'B', value: null },
      { group: '', value: 5 },
      { group: 'A', value: 7 },
    ]

    const out = listwiseExclude(rows, ['group', 'value'], 'Missing required values')

    expect(out.rows).toEqual([
      { group: 'A', value: 10 },
      { group: 'A', value: 7 },
    ])
    expect(out.report.originalRows).toBe(4)
    expect(out.report.analyzedRows).toBe(2)
    expect(out.report.excludedRows).toBe(2)
    expect(out.report.reason).toBe('Missing required values')
  })
})
