import { Node, Elements, FlowElement, getOutgoers, isEdge, getIncomers } from 'react-flow-renderer'

import { fragmentY } from './PlaybookTargetSettings'

import { updateXPosition, getChildElementsOfNo } from './playbookTargetUtils'

// TODO: remove if won't be neeeded
export function updatePosition(elements: Node[], increase: boolean = true, right: boolean = false) {
  return elements.map((element) => {
    const position = {
      x: right ? element.position.x + 2 * fragmentY : element.position.x,
      y: increase ? element.position.y + fragmentY : element.position.y - fragmentY,
    }
    return { ...element, position }
  })
}

// TODO: remove if won't be neeeded
export function getEdges(nodes: Elements) {
  return nodes.filter((node) => isEdge(node))
}
// TODO: remove if won't be neeeded **
// ** mean I don't trust the result
export function incresePositionTo(parentElements: any, item: any, elementsCopy: FlowElement<any>[]) {
  if (parentElements.length >= item.lengthToNode) {
    const increasedXParent = updateXPosition(parentElements, 2)
    let res: FlowElement<any>[] = elementsCopy.map((el) => {
      let updatedElement = increasedXParent.find((updatedEl: any) => updatedEl.id === el.id)
      return updatedElement ? { ...el, ...updatedElement } : el
    })

    elementsCopy.splice(0, elementsCopy.length, ...res)
  }
}
// TODO: remove if won't be neeeded **
export function updateParentElementsPosition(
  resultUpdate: { parentElements: any[]; childElement: any },
  elementsCopy: FlowElement<any>[],
) {
  if (resultUpdate.parentElements.length) {
    resultUpdate.parentElements.forEach((item) => {
      const parentElements = getChildElementsOfNo(item.parent, elementsCopy)
      incresePositionTo(parentElements, item, elementsCopy)
    })
  }
  return elementsCopy
}

export function getParentElementEndNode(node: Node, initialElements: Elements) {
  const yesXAxis = node.position.x
  const childElements = getOutgoers(node, initialElements)
  const noFirstChild = childElements.find((element) => element.position.x !== yesXAxis)
  return noFirstChild
}

export function getParentMainNoBranchPosition(node: Node, initialElements: Elements) {
  // requirements parent must be if/else element
  const directChildNodes = getOutgoers(node, initialElements)
  const NoChildElementPosition = directChildNodes[1].position
  return NoChildElementPosition
}

// TODO remove if not used
export function getParentNodes(node: Node, initialElements: Elements, dragOverElement?: any) {
  let chainOfParent: any[] = []
  ;(function transverse(nodes: Node[]) {
    // child of the dropped node branch
    // const nodeChild = nodes.find((node: Node) => node.id === dragOverElement?.target)
    for (let index = 0; index < nodes.length; index++) {
      chainOfParent.push(nodes[index])
      transverse([...getIncomers(nodes[index], initialElements)])
    }
  })(getIncomers(node, initialElements))
  return chainOfParent
}
