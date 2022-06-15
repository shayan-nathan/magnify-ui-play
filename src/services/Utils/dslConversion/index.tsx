import { ElementId } from 'react-flow-renderer'
import { dlsToReactFlow } from './dlsToReactFlow/dslToReactFlow'
import { reactFlowToDLS } from './reactFlowToDSL/reactFlowToDSL'

export { reactFlowToDLS, dlsToReactFlow }

// TODO: KEEP FOR DEBUGGING WILL BE REMOVED SOON
// export const getRandomId = (): ElementId => {
//   const idsOfNo = ['999', '998', '996']
//   const next = idsOfNo.pop()
//   return `${next}`
// }

export const getRandomId = (): ElementId => {
  const randomNo = Math.floor(Math.random() * 1000000)
  const data = Date.now().toString().slice(-6)
  return `${randomNo}${data}`
}
