import { RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'

const IGNORE = ['artboard', 'page', 'symbolMaster', 'text']

// type ForeignStyleMap = Map<StyleId, LibraryName>

//Override naming rule
export const overrideNaming: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    //Assert options are strings or arrays of strings
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

    // Get configuration options named
    const fillOverride = utils.getOption('fillOverride')
    const imageOverride = utils.getOption('imageOverride')
    const iconOverride = utils.getOption('iconOverride')
    const textOverride = utils.getOption('textOverride')
    assertOption(fillOverride)
    assertOption(imageOverride)
    assertOption(iconOverride)
    assertOption(textOverride)
    // const allowedPatterns = iconOverride.map((pattern) => new RegExp(pattern))

    if (fillOverride && imageOverride && iconOverride && textOverride) {
    }

    //Make a list of all icon symobls
    var foreignMasters: FileFormat.SymbolMaster[] = Array.from(utils.foreignObjects.symbolMaster)
    foreignMasters = foreignMasters.filter((master) => {
      return new RegExp('icon.+', 'i').test(master.name)
    })

    //Make a list of all foreign styles
    // const foreignStyles: ForeignStyleMap = new Map(
    //   [...utils.foreignObjects.MSImmutableForeignLayerStyle].map((o) => [
    //     o.localSharedStyle.do_objectID,
    //     o.sourceLibraryName,
    //   ]),
    // )

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
                `Icon layer ${layer.name} should be prefixed with "${iconOverride[0]}"  (followed by a space).`,
                layer,
              )
            }
          }
        } else if (layer._class === FileFormat.ClassValue.Text) {
          var match = false
          for (const requirement of textOverride) {
            if (new RegExp('^' + requirement + ' .+$').test(layer.name)) {
              match = true
            }
          }
          if (!match) {
            utils.report(
              `Text layer ${layer.name} should be prefixed with "${textOverride[0]}"  (followed by a space).`,
              layer,
            )
          }
        } else if (layer.style?.fills?.find((fill) => fill.image)) {
          var match = false
          for (const requirement of imageOverride) {
            if (new RegExp('^' + requirement + ' .+$').test(layer.name)) {
              match = true
            }
          }
          if (!match) {
            utils.report(
              `Image layer ${layer.name} should be prefixed with "${imageOverride[0]}" (followed by a space).`,
              layer,
            )
          }
        } else if (!IGNORE.includes(layer._class)) {
          if (typeof layer.sharedStyleID === 'string') {
            if (layer.style?.borders?.length) continue //Ignore styles with borders
            if (layer.style?.shadows?.length) continue //Ignore styles with shadows
            var match = false
            for (const requirement of fillOverride) {
              if (new RegExp('^' + requirement + ' .+$').test(layer.name)) {
                match = true
              }
            }
            if (!match) {
              utils.report(
                `Fill layer ${layer.name} should be prefixed with "${fillOverride[0]}" (followed by a space).`,
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
  description: 'Checks that overrides includes specified prefixes',
}
