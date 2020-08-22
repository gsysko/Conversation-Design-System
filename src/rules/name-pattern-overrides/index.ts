import { RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'

const IGNORE = ['artboard', 'page', 'symbolMaster', 'text']

// type ForeignStyleMap = Map<StyleId, LibraryName>

//Override naming rule
export const overrideNaming: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    //Assert options are strings or arrays of strings
    function assertOption(value: unknown): asserts value is string {
      if (typeof value !== 'string') {
        throw new Error('Option array element is not a string')
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

    if (fillOverride && imageOverride && iconOverride && textOverride) {
    }

    //Make a list of all icon symobls (following sunco "icon/..." or garden "<size>px-icons/..." format)
    var foreignMasters: FileFormat.SymbolMaster[] = Array.from(utils.foreignObjects.symbolMaster)
    foreignMasters = foreignMasters.filter((master) => {
      return new RegExp('(?:/|^)(?:ddpx-)?icon(?!-).+', 'i').test(master.name)
    })

    //TODO: Exempt overrides that have been toggled off.
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
            if (!new RegExp('^↪?' + iconOverride + ' .+$').test(layer.name)) {
              utils.report(
                `Icon layer ${layer.name} should be prefixed with "${iconOverride}"  (followed by a space).`,
                layer,
              )
            }
          }
        } else if (layer._class === FileFormat.ClassValue.Text) {
          if (!new RegExp('^↪?' + textOverride + ' .+$').test(layer.name)) {
            utils.report(
              `Text layer ${layer.name} should be prefixed with "${textOverride}"  (followed by a space).`,
              layer,
            )
          }
        } else if (layer.style?.fills?.find((fill) => fill.image)) {
          if (!new RegExp('^↪?' + imageOverride + ' .+$').test(layer.name)) {
            utils.report(
              `Image layer ${layer.name} should be prefixed with "${imageOverride}" (followed by a space).`,
              layer,
            )
          }
        } else if (!IGNORE.includes(layer._class)) {
          if (typeof layer.sharedStyleID === 'string') {
            if (layer.style?.borders?.length) continue //Ignore styles with borders
            if (layer.style?.shadows?.length) continue //Ignore styles with shadows
            if (!new RegExp('^↪?' + fillOverride + ' .+$').test(layer.name)) {
              utils.report(
                `Fill layer ${layer.name} should be prefixed with "${fillOverride}" (followed by a space).`,
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
