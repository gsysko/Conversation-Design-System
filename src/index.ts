import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

//Pages Required Rule
const pageNaming: RuleDefinition = {
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
  name: 'conversation-design-system/name-required-pages',
  title: 'Require page not found',
  description:
    'Checkst the following required pages are present: ⚛️ symbols, 💁‍♂️‍ component overview.',
}

//Override naming rule
const overrideNaming: RuleDefinition = {
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
    const iconOverride = utils.getOption('iconOverride')
    assertOption(iconOverride)

    //Check icon overrides
    for (const requirement of iconOverride) {
      // var found = false
      // Iterate
      for (const symbol of utils.objects.symbolMaster) {
        for const override of symbol.overrides
        throw new Error(symbol.ov + requirement)
        // Test
        // if (value.includes(requirement)) {
        //   // Report
        //   found = true
        // }
      }

      //Report
      // if (!found) {
      //   utils.report(`Page “${requirement}” not found.`)
      // }
    }
  },
  name: 'conversation-design-system/name-pattern-overrides',
  title: 'Override not named correctly',
  description: '.....',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'conversation-design-system',
      rules: [pageNaming, overrideNaming],
      config: {
        rules: {
          'conversation-design-system/name-required-pages': {
            active: true,
            required: ['⚛️ symbols', '💁‍♂️ component overview'],
          },
          '@sketch-hq/sketch-core-assistant/name-pattern-pages': {
            active: true,
            allowed: [
              '⚛️ symbols',
              '💁‍♂️ component overview',
              '💁\\‍S\\S component overview',
              '💁‍♀️ component overview',
              '🏝 .+',
            ],
            forbidden: [],
            ruleTitle: 'Non-standard page name found',
          },
          'conversation-design-system/name-pattern-overrides': {
            active: true,
            iconOverride: ['⚡️', '↪️⚡️'],
          },
        },
      },
    }
  },
]

export default assistant
