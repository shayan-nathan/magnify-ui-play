import { Action, PlaybookActionsType, LooseObject, Platform } from '../PlaybookBuilderTypes'

export const filterActions = (builderSettings: PlaybookActionsType, searchValue: string): PlaybookActionsType => {
  const filtereOptions: LooseObject = {}
  for (const category in builderSettings) {
    const categorySources = (builderSettings as unknown as { [key: string]: Action[] | Platform[] })[category]
    // the option for actions are treated differently because they appear in a different way
    if (category !== 'actions') {
      const actions = categorySources as Action[]
      const passedCondition = actions.filter(filterBySearchedValue)
      if (passedCondition.length) {
        filtereOptions[category] = passedCondition
      }
    } else {
      filtereOptions[category] = []
      const platforms = categorySources as Platform[]

      platforms.forEach((platform) => {
        const actionsThatPassCondition = platform.actions.filter(filterBySearchedValue)
        const IsPlatformPassCondition = platform.name.toLowerCase().includes(searchValue.toLowerCase())
        let filteredCategory
        if (actionsThatPassCondition.length) {
          filteredCategory = { ...platform, ...{ actions: actionsThatPassCondition } }
          filtereOptions[category].push(filteredCategory)
        } else if (IsPlatformPassCondition) {
          filtereOptions[category].push(platform)
        }
      })
    }
  }
  function filterBySearchedValue(action: Action) {
    return action.name.toLowerCase().includes(searchValue.toLowerCase())
  }
  return filtereOptions as PlaybookActionsType
}
