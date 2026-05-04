import { describe, expect, it } from 'vitest'
import { parseCsv } from './csv'

describe('parseCsv', () => {
  it('parses quoted fields that contain commas', () => {
    const parsed = parseCsv('name,score,group\n"Doe, Jane",88,A\n"Smith, John",91,B')

    expect(parsed.headers).toEqual(['name', 'score', 'group'])
    expect(parsed.rows[0].name).toBe('Doe, Jane')
    expect(parsed.rows[1].name).toBe('Smith, John')
  })

  it('infers numeric columns when at least 80% values are numeric', () => {
    const parsed = parseCsv('x,label\n1,a\n2,b\n3,c\nfoo,d\n4,e')

    expect(parsed.inferredKinds.x).toBe('numeric')
    expect(parsed.inferredKinds.label).toBe('categorical')
  })

  it('throws when CSV has no data rows', () => {
    expect(() => parseCsv('a,b')).toThrow(/header row and at least one data row/i)
  })
})
