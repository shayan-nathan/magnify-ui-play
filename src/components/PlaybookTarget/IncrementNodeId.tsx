import { ElementId } from 'react-flow-renderer'
import { getRandomId } from 'services/Utils/dslConversion'

// TODO: keep this for debugging purposes
// let INITIAL_ELEMENT_ID = 4
// export const getId = (): ElementId => `${++INITIAL_ELEMENT_ID}`

export const getId = (): ElementId => {
  return getRandomId()
}
