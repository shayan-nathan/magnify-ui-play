import { ArrowHeadType, Edge, Elements, Node } from 'react-flow-renderer'
import { toJS } from 'mobx'

import {
  INITIAL_X_POSITION,
  INITIAL_Y_POSITION,
  fragmentY,
  fragmentX,
} from 'components/PlaybookTarget/PlaybookTargetSettings'
import {
  camelCaseToNormalCase,
  camelToSnakeCase,
  getOnlyLetters,
  getOnlyNumbers,
} from 'services/Utils/parseString.utils'
import { getRandomId } from '..'

import { Dsl, EdgeOption, RecursiveModel } from 'models'

const intitialPosition = {
  x: INITIAL_X_POSITION,
  y: INITIAL_Y_POSITION,
}
let treeObject: any = {}

export function dlsToReactFlow(dsl: Dsl): Elements {
  const stateName = dsl.startAt

  recursiveTraverse({ flow: dsl, stateName })
  const treeStructure = { ...treeObject }
  // reset settings/helper objects
  treeObject = {}
  const uIElements: Elements = Object.values(treeStructure)
  return uIElements
}

/**
 * Return a new JSON object in React flow Node format
 * @param {any} stateElement - current state object.
 * @param {string} stateName - current state object name.
 * @param {number} level - the level of element used for vertical aligment.
 * @param {string} parentStateName - the name of the parent state.
 * @param {string} positionX - the position on x axis used for horizontal aligment.
 */
function newNode(stateElement: any, stateName: string, parentStateName: string, isNoBranch: boolean | undefined): Node {
  // there are 2 type of nodes, normal nodes and end nodes
  // normal nodes will have the id of the state name
  // end nodes will have the name of parent node with end suffix

  const isIfElse = getOnlyLetters(stateName) === 'ifElse'
  const node = {
    id: `${getOnlyNumbers(stateName)}`,
    type: 'segment',
    data: {
      // Here you can update the react flow node data based on DSL (endpoint response)
      type: stateElement.type,
      name: `${isIfElse ? 'If / Else' : camelCaseToNormalCase(getOnlyLetters(stateName))}`,
      ...(stateElement.payload && { payload: stateElement.payload }),
      ...(getOnlyLetters(stateName) === 'End' && { isFinal: true }),
      ...(getOnlyLetters(stateName) !== 'End' && { shape: getShapeOfElement(stateElement.type) }),
      data: { edgeLabel: `${isNoBranch ? 'no' : 'yes'}` },
      iconName: `${getOnlyLetters(camelToSnakeCase(stateName))}`,
      ...(stateElement.description && { description: stateElement.description }),
    },
    position: {
      x: isNoBranch ? treeObject[parentStateName].position.x + fragmentX : treeObject[parentStateName].position.x,
      y: treeObject[parentStateName].position.y + fragmentY,
    },
  }
  return node
}

function edge(options: EdgeOption): Edge {
  const { stateName, parentStateName, end, isNoBranch } = options
  const newEdge: Edge = {
    id: `e${getOnlyNumbers(parentStateName)}-${getOnlyNumbers(stateName)}`,
    source: end ? `${getOnlyNumbers(stateName)}` : `${getOnlyNumbers(parentStateName)}`,
    target: end ? `${getOnlyNumbers(parentStateName)}` : `${getOnlyNumbers(stateName)}`,
    type: 'custom',
    data: { edgeLabel: `${isNoBranch ? 'no' : 'yes'}` },
    sourceHandle: isNoBranch ? 's-right' : 's-bottom',
    targetHandle: 't-top',
    arrowHeadType: ArrowHeadType.Arrow,
  }

  return newEdge
}

function recursiveTraverse(option: RecursiveModel) {
  const { flow, stateName, parentStateName, isNoBranch } = option
  // flow - JSON in ASL format https://states-language.net/spec.html
  // stateName - current state name
  const currentState = flow.states[stateName]
  const isBranch = currentState?.type === 'ifElse'

  if (!parentStateName) {
    // the initial state doesn't have a parent state and requires a specific treat
    // Here you can update the react flow Segment node data based on DSL (endpoint response)
    const segmentNode = {
      id: '1',
      type: 'segment',
      data: {
        isInitial: true,
        ...(currentState.payload && { payload: toJS(currentState.payload) }),
        ...(currentState.description && { description: currentState.description }),
        name: 'Segments',
        shape: 'circle',
        iconName: 'segment',
      },
      position: {
        x: intitialPosition.x,
        y: intitialPosition.y,
      },
    }
    treeObject[stateName] = segmentNode

    if (currentState.end) {
      // the initial view when only the segment is configured
      const randomNo = getRandomId()

      const endNode = {
        id: `${randomNo}`,
        type: 'end',
        data: { isFinal: true, name: 'End' },
        position: { x: segmentNode.position.x, y: segmentNode.position.y + fragmentY },
      }

      const newEdge: Edge = {
        id: `e1-${randomNo}`,
        source: `1`,
        target: `${randomNo}`,
        type: 'custom',
        data: { edgeLabel: `yes` },
        sourceHandle: 's-bottom',
        targetHandle: 't-top',
        arrowHeadType: ArrowHeadType.Arrow,
      }

      treeObject['end_if_Else' + randomNo] = endNode
      treeObject[newEdge.id] = newEdge
      // console.log('add  endNode newEdge', endNode, newEdge)
    }
  } else {
    const node = newNode(currentState, stateName, parentStateName, isNoBranch)
    const newEdge = edge({ stateName, parentStateName, isNoBranch })
    treeObject[stateName] = node
    treeObject[newEdge.id] = newEdge
    // TODO: Daniel, Remove this lines of code once DLS works perfectly
    // console.log('add node, newEdge', node, newEdge)
    // if (currentState.end && !isBranch) {
    //   // The case when a normal case ends
    //   const parentElementPosition = treeObject[stateName].position
    //   generateEndNodeEdgePair(parentElementPosition, stateName, treeObject)
    // }
  }

  const nextStateName = currentState?.next ? currentState?.next : currentState.default
  if (nextStateName) {
    recursiveTraverse({ flow, stateName: nextStateName, parentStateName: stateName })
  }

  if (isBranch) {
    const parentElementPosition = treeObject[stateName].position
    // TODO: implement a way to add them for multiple choices not just yes and no
    if (currentState.choices[0]?.next) {
      recursiveTraverse({
        flow,
        stateName: currentState.choices[0]?.next,
        parentStateName: stateName,
        isNoBranch: true,
      })
    }
    if (currentState.choices[0]?.end) {
      // is branch and has an END node on the no branch
      // create end based on the parent x incredemented of the parent y increment
      // console.log('generate end on no branch')
      generateEndNodeEdgePair(parentElementPosition, stateName, treeObject, true)
    }
    if (!currentState.default) {
      // is branch and has an END node on the yes branch
      // create end based on the x of the parent y increment
      // console.log('generate end on YESSS branch')
      generateEndNodeEdgePair(parentElementPosition, stateName, treeObject)
    }
  }
}

function generateEndNodeEdgePair(parentPosition: any, stateName: string, treeObj: any, isNoBranch?: boolean) {
  const randomNo = getRandomId()
  const endNode = {
    id: `${randomNo}`,
    type: 'end',
    data: { isFinal: true, name: 'End' },
    // if is on YES branch increment only the Y position
    // if is on NO branch increment both axis
    position: { x: isNoBranch ? parentPosition.x + fragmentX : parentPosition.x, y: parentPosition.y + fragmentY },
  }

  const endEdge: Edge = {
    id: `e${getOnlyNumbers(stateName)}-${randomNo}`,
    source: `${getOnlyNumbers(stateName)}`,
    target: `${randomNo}`,
    type: 'custom',
    data: { edgeLabel: isNoBranch ? 'no' : 'yes' },
    sourceHandle: isNoBranch ? 's-right' : 's-bottom',
    targetHandle: 't-top',
    arrowHeadType: ArrowHeadType.Arrow,
  }
  treeObj['end_if_Else' + randomNo] = endNode
  treeObj[endEdge.id] = endEdge
}

function getShapeOfElement(value: string) {
  switch (value) {
    case 'segment':
      // Tergeting
      return 'circle'
    case 'ifElse':
    case 'waitForTrigger':
    case 'timeDelay':
    case 'loop':
      // Rules
      return 'rhomb'
    default:
      // Actions
      return 'square'
  }
}
