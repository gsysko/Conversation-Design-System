import { RuleDefinition } from '@sketch-hq/sketch-assistant-types'

//Pages Required Rule
export const pageNaming: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    //TODO: need to improve this to use regex, so emoji are do not need to be gendered/color specific.
    function assertOption(value: unknown): asserts value is string[] {
      if (!Array.isArray(value)) {
        throw new Error('Option value is not an array')
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string') {
          throw new Error('Option array element is not a string')
        }
      }
    }

    // Get a configuration option named "required"
    const required = utils.getOption('required')
    assertOption(required)

    for (const requirement of required) {
      var found = false
      // Iterate
      for (const page of utils.objects.page) {
        const value = page.name
        // Test
        if (value.includes(requirement)) {
          // Report
          found = true
        }
      }

      //Report
      if (!found) {
        utils.report(`Page “${requirement}” not found.`)
      }
    }
  },
  name: 'conversation-design-system/pages-required',
  title: 'Require page not found',
  description:
    'Checks the following required pages are present: ⚛️ symbols, 💁‍♂️‍ component overview.',
}
