import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'

test('test assistant', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './temp-assistant-test.sketch'),
    Assistant,
  )
  expect(violations[0].message).toBe('Layer name does not match any of the allowed patterns')
  expect(ruleErrors).toHaveLength(0)
})
