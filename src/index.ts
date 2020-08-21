import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage } from '@sketch-hq/sketch-assistant-types'
import { pageNaming } from './rules/pages-required'
import { overrideNaming } from './rules/name-pattern-overrides'

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'conversation-design-system',
      rules: [pageNaming, overrideNaming],
      config: {
        rules: {
          'conversation-design-system/pages-required': {
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
            fillOverride: ['🎨', '↪🎨'],
            iconOverride: ['⚡️', '↪⚡️'],
            imageOverride: ['🖼', '↪🖼'],
            textOverride: ['✏️', '↪✏️'],
          },
        },
      },
    }
  },
]

export default assistant
