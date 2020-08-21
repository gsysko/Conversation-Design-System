import { RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'

//Override naming rule
export const overrideNaming: RuleDefinition = {
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
    // const allowedPatterns = iconOverride.map((pattern) => new RegExp(pattern))

    //Make a list of all icon symobls
    var foreignMasters: FileFormat.SymbolMaster[] = Array.from(utils.foreignObjects.symbolMaster)
    foreignMasters = foreignMasters.filter((master) => {
      return new RegExp('icon.+', 'i').test(master.name)
    })

    // Iterate all symbol
    const masters = Array.from(utils.objects.symbolMaster)
    for (const master of masters) {
      const layers = Array.from(master.layers)
      for (const layer of layers) {
        if (layer._class === FileFormat.ClassValue.SymbolInstance) {
          if (
            foreignMasters.some((master) => {
              return master.symbolID === layer.symbolID
            })
          ) {
            var match = false
            for (const requirement of iconOverride) {
              if (new RegExp('^' + requirement + ' .+$').test(layer.name)) {
                match = true
              }
            }
            if (!match) {
              utils.report(
                `Icon layer ${layer.name} should be prefixed with "${iconOverride[0]} ".`,
                layer,
              )
            }
          }
        }
      }
    }
  },
  name: 'conversation-design-system/name-pattern-overrides',
  title: 'Override not named correctly',
  description: '.....',
}
