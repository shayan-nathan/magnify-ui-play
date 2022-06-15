import { Edge, Elements, getConnectedEdges, Node } from 'react-flow-renderer'

import {
  createEdge,
  getChildElementsOfYes,
  getChildNodes,
  getSiblingsYAxisNodes,
  updateYPosition,
} from 'components/PlaybookTarget/playbookTargetUtils'
import { branchType } from 'components/PlaybookTarget/PlaybookTargetSettings'

export function getElementsAfterDeleteNode(id: string, nodes: Node[], edges: Edge[]): Elements {
  // Get the node that needs to be removed
  const node = nodes.find((node) => node.id === id)
  const elements = [...nodes, ...edges]
  if (!node) {
    return elements
  }
  const childOfRemovedEl = getChildNodes(node, elements)
  const nodesWithoutRemoved = nodes.filter((node) => node.id !== id)
  const { parentNode, childNode } = getSiblingsYAxisNodes(node, elements)

  if (isBranchNode(node)) {
    // branch delete logic
    const childNodesOnYesBranch = getChildElementsOfYes(node, elements)
    const endNode = childNodesOnYesBranch.pop()

    // get the difference between removed element and end node
    const unitsToUpdate = childNodesOnYesBranch.length + 1
    // update end node position
    const updatedYPosition = updateYPosition([endNode], -unitsToUpdate)

    const upperNodes = nodesWithoutRemoved.filter((node) => {
      const isChild = childOfRemovedEl.some((childNode) => childNode.id === node.id)
      return !isChild
    })

    const edgesToRemove = getConnectedEdges([node], edges)

    childOfRemovedEl.forEach((node) => {
      const targetEdge = getConnectedEdges([node], edges)
      if (targetEdge) {
        edgesToRemove.push(...targetEdge)
      }
    })
    const edgesWithoutRemoved = edges.filter((val) => !edgesToRemove.includes(val))

    // Get new edge based on the siblings nodes of the removed node
    const edgeOfSiblings = createEdge({ parentNode: parentNode, childNode: updatedYPosition[0] })
    const finalEdges = [...edgesWithoutRemoved, edgeOfSiblings]

    const finalResult = [...upperNodes, ...updatedYPosition, ...finalEdges]

    return finalResult
  }
  // Get the edges to remove
  const edgesToRemove = getConnectedEdges([node], edges)
  const edgesWithoutRemoved = edges.filter((val) => !edgesToRemove.includes(val))

  const updatedYPosition = updateYPosition(childOfRemovedEl, -1)
  const finalPositionNodes = mergeArraysWithoutDuples(nodesWithoutRemoved, updatedYPosition)

  // Get new edge based on the siblings nodes of the removed node
  const edgeOfSiblings = createEdge({ parentNode: parentNode, childNode: childNode })

  const finalEdges = [...edgesWithoutRemoved, edgeOfSiblings]

  return [...finalPositionNodes, ...finalEdges]
}

function isBranchNode(node: Node) {
  return node.data.type === branchType
}

export function mergeArraysWithoutDuples(initialNodes: Node[], updatedNodes: Node[]): Node[] {
  const merged = [...initialNodes]
  for (let i = 0; i < merged.length; i++) {
    for (let j = 0; j < updatedNodes.length; j++) {
      if (merged[i].id === updatedNodes[j].id) {
        merged.splice(i, 1, updatedNodes[j])
        break
      }
    }
  }
  return merged
}

export const getPlatformsToBeDisplayed = (elements: any) => {
  let platforms: any = []

  const searchInGroup = (group: any) => {
    if (group.groups) {
      group.groups.forEach((element: any) => {
        if (element.groups) {
          return searchInGroup(element)
        } else if (!platforms.includes(element.platform)) platforms.push(element.platform)
      })
    }
  }

  if (elements?.groups?.length) {
    searchInGroup(elements)
  }

  return platforms
}
