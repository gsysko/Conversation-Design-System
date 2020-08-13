import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const pageNaming: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

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
  name: 'conversation-design-system/name-required-pages',
  title: 'Require page not found',
  description:
    'Checkst the following required pages are present: ⚛️ symbols, 💁‍ component overview.',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'conversation-design-system',
      rules: [pageNaming],
      config: {
        rules: {
          'conversation-design-system/name-required-pages': {
            active: true,
            required: ['⚛️ symbols', '💁‍ component overview'],
          },
          '@sketch-hq/sketch-core-assistant/name-pattern-pages': {
            active: true,
            allowed: ['⚛️ symbols', '💁‍ component overview', '🏝 .+'],
            forbidden: [],
            ruleTitle: 'Non-standard page name found',
          },
        },
      },
    }
  },
]

export default assistant
