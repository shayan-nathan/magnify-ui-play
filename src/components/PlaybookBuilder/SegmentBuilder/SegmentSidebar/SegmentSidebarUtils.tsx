import { MetadataDescription, MetadataRoot } from 'models'
import { sanitizeString } from 'services/Utils/parseString.utils'

export function getMenuListFromPath(paths: string[], data: any) {
  let selectedObject: MetadataRoot | undefined
  for (let i = 0; i < paths.length; i++) {
    const current = paths[i]
    if (!i) {
      selectedObject = getObjectFromList(data, current)
    } else {
      selectedObject = getObjectFromList(selectedObject?.data, current)
    }
  }
  return selectedObject
}

export function getObjectFromList(
  objectFields: MetadataDescription[] | undefined,
  searchedTerm: string,
): MetadataRoot | undefined {
  if (objectFields !== undefined) {
    const data = objectFields.find((item) => {
      return sanitizeString(item.name) === sanitizeString(searchedTerm)
    })
    return data
  }
}
