import { Edge, Node, Elements, isEdge, isNode } from 'react-flow-renderer'

import { Dsl, NodeState, RecursiveTraverse } from 'models'
import { getOnlyLetters, toCamelCase } from 'services/Utils/parseString.utils'

export function reactFlowToDLS(elements: Elements): Dsl {
  const startAt = elements.find((el) => el.data.isInitial === true)
  // initial state
  const states = {}

  const result = {
    comment: 'Increase someting DSL',
    title: 'Increase someting DSL',
    startAt: `${toCamelCase(startAt?.data.name || '')}${startAt?.id}` || '',
    states: states,
  }
  recursiveTraverse({
    elements,
    nodeId: startAt?.id,
    states,
  })
  return result
}

function recursiveTraverse(props: RecursiveTraverse) {
  const { elements, nodeId, states, prevNodeKey, edgeIndex } = props

  if (!nodeId) {
    return
  }

  const nodes = getNodes(elements)
  const edges = getEdges(elements)
  // the current node
  const currentNode = nodes.find((node) => node.id === nodeId)
  // the edge that start from the current node
  const edgesOfNode = edges.filter((edge) => edge.source === currentNode?.id)

  const isEndNode = !edgesOfNode.length
  const isBasicNode = edgesOfNode.length === 1
  const isBranchNode = edgesOfNode.length > 1
  const currentNodeName = toCamelCase(currentNode?.data.name || '')
  const currentNodeId = currentNode?.id
  const currentNodeKey = `${currentNodeName}${currentNodeId}`
  const currentObject: NodeState = {
    // Here you can update the DSL data based on the react flow node data
    type: currentNodeName === 'segments' ? 'segment' : currentNodeName,
    ...(currentNode?.data.payload && { payload: { ...currentNode?.data.payload } }),
    ...(currentNode?.data.description && { description: currentNode?.data.description }),
  }

  states[currentNodeKey] = currentObject
  const isYesBranch = edgeIndex === 0
  const isNoBranch = edgeIndex && edgeIndex > 0
  // prevNodeKey doesnt exist only for the first iteration
  if (prevNodeKey) {
    // if there is a previous node add to it the current node as next
    states[prevNodeKey].next = currentNodeKey
  }
  // default of a branch (yes)
  if (prevNodeKey && isYesBranch) {
    // if there is a previous node and the index is 0 it means it's on the yes branch
    states[prevNodeKey].default = currentNodeKey
  }

  if (prevNodeKey && isNoBranch) {
    // next of a branch (no)
    states[prevNodeKey].choices = [
      {
        next: currentNodeKey,
      },
    ]

    states[prevNodeKey].type = prevNodeKey === 'segments' ? 'segment' : getOnlyLetters(prevNodeKey)
    // it's a choice type we don't need next
    delete states[prevNodeKey].next
  }

  if (isBranchNode) {
    edgesOfNode.forEach((edge, edgeIndex) => {
      recursiveTraverse({
        elements,
        nodeId: edge.target,
        states,
        prevNodeKey: currentNodeKey,
        edgeIndex: edgeIndex,
      })
    })
  }

  if (isBasicNode) {
    recursiveTraverse({
      elements,
      nodeId: edgesOfNode[0].target,
      states,
      prevNodeKey: currentNodeKey,
    })
  }

  if (isEndNode && prevNodeKey) {
    if (!states[prevNodeKey].default) {
      // if the parent node is branch and doesn't have a default it means it's an end
      states[prevNodeKey].end = true
      delete states[prevNodeKey].next
    }
    if (isYesBranch) {
      // if the current node is end this should be reflected into parent elment dsl
      states[prevNodeKey].end = true
      delete states[prevNodeKey].default
    }
    if (isNoBranch && states[prevNodeKey].choices?.length) {
      // for no branch the end should be added into the choice array
      const choiceState = states[prevNodeKey].choices
      if (choiceState) {
        choiceState[0].end = true
        delete choiceState[0].next
      }
    }
    delete states[currentNodeKey]
  }
}

function getNodes(elements: Elements): Node[] {
  const nodes = elements.filter((el) => isNode(el))
  return nodes as Node[]
}
function getEdges(elements: Elements): Edge[] {
  const edges = elements.filter((el) => isEdge(el))
  return edges as Edge[]
}
