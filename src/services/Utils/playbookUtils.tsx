import { ArrowHeadType, Edge, Node } from 'react-flow-renderer'
interface RecursiveModel {
  flow: any
  stateName: string
  parentStateName?: string
}
const intitialPosition = {
  x: 250,
  y: 50,
}
const DISTANCE = 200

let level = 0
let treeObject: any = {}

function getTreeStructure(flow: any) {
  const stateName = flow.StartAt
  recursiveTraverse({ flow, stateName })

  const treeStructure = { ...treeObject }
  // reset settings/helper objects
  level = 0
  treeObject = {}
  return treeStructure
}
/**
 * Return a new JSON object in React flow Node format
 * @param {any} stateElement - current state object.
 * @param {string} stateName - current state object name.
 * @param {number} level - the level of element used for vertical aligment.
 * @param {string} parentStateName - the name of the parent state.
 * @param {string} positionX - the position on x axis used for horizontal aligment.
 */
function newElement(
  stateElement: any,
  stateName: string,
  level: number = 0,
  parentStateName: string,
  positionX: string,
): Node {
  // get the position for Y axis
  const getNextYPosition = (level = 0): number => {
    const yPosition = level * DISTANCE + intitialPosition.y
    return yPosition
  }

  // get the position for X axis
  const getNextXPosition = (direction: string, parentX = 250) => {
    const DISTANCEX = 300

    let x = parentX
    switch (direction) {
      case 'left':
        x = parentX - DISTANCEX
        break
      case 'right':
        x = parentX + DISTANCEX
        break

      default:
        x = parentX
        break
    }
    return x
  }

  // there are 2 type of nodes, normal nodes and end nodes
  // normal nodes will have the id of the state name
  // end nodes will have the name of parent node with end suffix
  const node = {
    id: stateName === 'end' ? `${parentStateName}_end` : stateName,
    type: stateName === 'end' ? 'end' : 'thumbnail',
    data: {
      state: stateName,
      isInitial: false,
      childOf: parentStateName,
      level: level,
      cardType: stateElement.Type,
      ...stateElement,
      ...stateElement.Parameters,
    },
    position: {
      x: getNextXPosition(positionX, treeObject[parentStateName].position.x),
      y: getNextYPosition(level),
    },
  }
  return node
}
interface EdgeOption {
  stateName: string
  parentStateName: string
  end?: boolean
}
function edge(options: EdgeOption): Edge {
  const { stateName, parentStateName, end } = options
  const newEdge: Edge = {
    id: `e${parentStateName}-${end ? 'end' : stateName}`,
    source: end ? `${stateName}` : parentStateName,
    target: end ? `${parentStateName}_end` : stateName,
    type: treeObject[parentStateName]?.data?.Type === 'Choice' && !end ? 'straight' : 'custom',
    data: { text: 'custom edge' },
    arrowHeadType: ArrowHeadType.Arrow,
  }
  return newEdge
}

/**
 * Returns the position where the current state object should move on x compared to the parent
 * @param {any} parentData - parent state object.
 * @param {string} stateName - current state object name.
 */
function getXPosition(parentData: any, stateName: string): string {
  let positionX = 'initial'
  if (parentData?.cardType === 'Choice') {
    if (parentData.Choices[0]?.Next === stateName) {
      positionX = 'left'
      level = parentData.level + 1
    }
    if (parentData.Default === stateName) {
      positionX = 'right'
      level = parentData.level + 1
    }
  }

  return positionX
}

function recursiveTraverse(option: RecursiveModel) {
  const { flow, stateName, parentStateName } = option
  // console.log('option', option)
  // flow - JSON in ASL format https://states-language.net/spec.html
  // stateName - current state name
  // parentStateName - the parent of the stateName
  const currentState = flow.States[stateName]

  if (!parentStateName) {
    // the initial state doesn't have a parent state and requires a specific treat
    const newElement = {
      id: stateName,
      type: 'thumbnail',
      data: { isInitial: true, ...currentState, state: stateName },
      position: {
        x: intitialPosition.x,
        y: intitialPosition.y,
      },
    }
    treeObject[stateName] = newElement
  } else {
    level++
    const positionX = getXPosition(treeObject[parentStateName]?.data, stateName)
    const node = newElement(currentState, stateName, level, parentStateName, positionX)
    // console.log('new node---', node)
    const newEdge = edge({ stateName, parentStateName })
    // console.log('newEdge---', newElement)
    treeObject[stateName] = node
    treeObject[newEdge.id] = newEdge

    if (currentState?.End) {
      // console.log(`Leaf current: ${stateName} | parent: ${parentStateName}`)
      if (parentStateName) {
        const node = newElement(currentState, 'end', level + 1, parentStateName, positionX)
        const newEdge = edge({ stateName, parentStateName, end: true })

        treeObject[newEdge.id] = newEdge
        treeObject[`${stateName}_end`] = node
      }
    }
  }

  const nextStateName = currentState?.Next ? currentState?.Next : currentState.Default
  if (nextStateName) {
    recursiveTraverse({ flow, stateName: nextStateName, parentStateName: stateName })
  }

  if (currentState?.Type === 'Choice') {
    // TODO: implement a way to add them for multiple choices not just yes and no
    if (currentState?.Type === 'Choice' && currentState.Choices[0]?.Next) {
      recursiveTraverse({ flow, stateName: currentState.Choices[0]?.Next, parentStateName: stateName })
    }
  }
}

export { getTreeStructure }
