import { RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'

// const IGNORE = ['artboard', 'page', 'symbolMaster']

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

    //Make a list of all icon symobls (following sunco "icon/..." or garden "<size>px-icons/..." format)
    var foreignMasters: FileFormat.SymbolMaster[] = Array.from(utils.foreignObjects.symbolMaster)
    foreignMasters = foreignMasters.filter((master) => {
      return new RegExp('(?:/|^)(?:ddpx-)?icon(?!-).+', 'i').test(master.name)
    })

    //TODO: Exempt overrides that have been toggled off.
    const layers = Array.from(utils.objects.anyLayer)

    // Iterate all symbol
    const masters = Array.from(utils.objects.symbolMaster)

    for (const master of masters) {
      const overrides = Array.from(master.overrideProperties)
      for (const override of overrides) {
        //seperate override properties into the id of the layer the override and the type
        const overrideDetail = override.overrideName.match(new RegExp('^.+(?=_)|_.+', 'g'))
        if (override.canOverride && overrideDetail) {
          const layer = layers.find((layer) => layer.do_objectID === overrideDetail[0])
          if (layer) {
            switch (overrideDetail[1]) {
              case '_image':
                //check image format
                if (!new RegExp('^↪?' + imageOverride + ' .+$').test(layer.name)) {
                  utils.report(
                    `Image layer ${layer.name} should be prefixed with "${imageOverride}" (followed by a space).`,
                    layer,
                  )
                }
                break
              case '_stringValue':
                // check text format
                if (!new RegExp('^↪?' + textOverride + ' .+$').test(layer.name)) {
                  utils.report(
                    `Text layer ${layer.name} should be prefixed with "${textOverride}"  (followed by a space).`,
                    layer,
                  )
                }
                break
              case '_layerStyle':
                //check colors
                if (layer.style?.borders?.length) continue //Ignore styles with borders
                if (layer.style?.shadows?.length) continue //Ignore styles with shadows
                //We also account for styles that provide an image fill, but have the image override turned off
                if (layer.style?.fills?.find((fill) => fill.image)) {
                  //check image format
                  if (!new RegExp('^↪?' + imageOverride + ' .+$').test(layer.name)) {
                    utils.report(
                      `Image layer ${layer.name} should be prefixed with "${imageOverride}" (followed by a space).`,
                      layer,
                    )
                  }
                } else if (!new RegExp('^↪?' + fillOverride + ' .+$').test(layer.name)) {
                  //...otherwise we assume it is a color fill
                  utils.report(
                    `Fill layer ${layer.name} should be prefixed with "${fillOverride}" (followed by a space).`,
                    layer,
                  )
                }
                break
              case '_symbolID':
                //check icons
                if (
                  layer._class === FileFormat.ClassValue.SymbolInstance &&
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
                break
              default:
              //do nothing
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
