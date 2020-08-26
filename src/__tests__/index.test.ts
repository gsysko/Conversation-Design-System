import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'

test('test assistant', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './temp-assistant-test.sketch'),
    Assistant,
  )
  expect(violations[0].message).toBe('Layer name does not match any of the allowed patterns')
  expect(violations[1].message).toBe('Page “💁‍♂️ component overview” not found.')
  expect(violations[2].message).toBe(
    'Fill layer Rectangle (L) should be prefixed with "🎨" (followed by a space).',
  )
  expect(violations[3].message).toBe(
    'Text layer label (L) should be prefixed with "✏️"  (followed by a space).',
  )
  expect(violations[4].message).toBe(
    'Image layer pic (L) should be prefixed with "🖼" (followed by a space).',
  )
  expect(violations[5].message).toBe(
    'Icon layer ⚡️icon 2 (L) should be prefixed with "⚡️"  (followed by a space).',
  )
  expect(violations[6].message).toBe(
    'Image layer pic should be prefixed with "🖼" (followed by a space).',
  )
  expect(violations[7].message).toBe(
    'Fill layer Rectangle should be prefixed with "🎨" (followed by a space).',
  )
  expect(violations[8].message).toBe(
    'Icon layer ⚡️icon 2 should be prefixed with "⚡️"  (followed by a space).',
  )
  expect(violations[9].message).toBe(
    'Text layer label should be prefixed with "✏️"  (followed by a space).',
  )
  expect(violations).toHaveLength(10)
  expect(ruleErrors).toHaveLength(0)
})
