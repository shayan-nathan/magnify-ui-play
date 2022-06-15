import { toJS } from 'mobx'
import { Edge, Node, Elements, FlowElement, ArrowHeadType, getOutgoers, getIncomers } from 'react-flow-renderer'
import { getId } from './IncrementNodeId'

import { fragmentX, fragmentY, branchType, INITIAL_X_POSITION } from './PlaybookTargetSettings'

import { BuilderAction, CreateEdgeProps } from '../PlaybookBuilder/PlaybookBuilderTypes'

export const getElementById = (elements: Elements, id: string): FlowElement | undefined => {
  const element = elements.find((element) => {
    return element.id === id
  })
  return element
}

export function createEdge(props: CreateEdgeProps) {
  const { parentNode, childNode, dropEdge, isOnNoBranch } = props
  const childId = typeof childNode === 'string' ? childNode : childNode.id
  const edgeLabel =
    typeof dropEdge === 'string' || dropEdge === undefined ? dropEdge || 'yes' : dropEdge?.data?.edgeLabel

  return {
    id: `e${parentNode.id}-${childId}`,
    source: `${parentNode.id}`,
    target: `${childId}`,
    type: 'custom',
    sourceHandle: isOnNoBranch ? 's-right' : 's-bottom',
    targetHandle: 't-top',
    data: { edgeLabel: edgeLabel },
    arrowHeadType: ArrowHeadType.Arrow,
  }
}

export const addNode = (elementsList: Elements, dropElement: BuilderAction, additionalMethods: any) => {
  if (dropElement && Object.keys(dropElement).length === 0) {
    return elementsList
  }

  const dropEdge = toJS(dropElement)
  const isOnNoBranch = dropEdge?.data?.edgeLabel === 'no'

  const elementsCopy = [...elementsList]
  const parent = getElementById(elementsCopy, dropEdge.source) as Node
  const parentEdge = getElementById(elementsCopy, dropEdge.id) as Edge

  const [endOfCurrentNode] = [...getChildElementsOfNo(parent, elementsList)]

  let position = {
    x: isOnNoBranch ? parent?.position?.x + fragmentX : parent?.position?.x,
    y: parent?.position.y + fragmentY,
  }

  // if is dropped as a child of choice element get the end position
  if (endOfCurrentNode && isOnNoBranch) {
    position = {
      x: endOfCurrentNode.position.x,
      y: endOfCurrentNode.position.y - fragmentY,
    }
  }

  const newNode = {
    id: `${getId()}`,
    type: 'segment',
    data: { ...additionalMethods, ...dropEdge, payload: {} },
    position: position,
  }

  const newEdge = createEdge({
    parentNode: newNode,
    childNode: dropEdge.target,
  })
  const edgeToReplace = createEdge({ parentNode: parent, childNode: newNode, isOnNoBranch, dropEdge })

  const indexOfupdate = elementsCopy.indexOf(parentEdge)
  elementsCopy.splice(indexOfupdate, 1, ...[edgeToReplace, newNode, newEdge])

  if (dropElement.type === branchType) {
    const endNode = {
      id: `${getId()}`,
      type: 'end',
      data: { isFinal: true, name: 'End' },
      position: {
        x: newNode.position.x + fragmentX,
        y: newNode.position.y + fragmentY,
      },
    }

    const newEdge = createEdge({ parentNode: newNode, childNode: endNode, isOnNoBranch: true, dropEdge: 'no' })

    elementsCopy.push(endNode, newEdge)
  }

  const result = [...updateParentIfPosition(newNode, elementsCopy)]
  return [...result]
}

export function getChildElementsOfNo(node: Node, initialElements: Elements) {
  const chainOfChildrens: Node[] = []
  const yesXAxis = node?.position?.x

  ;(function transverse(nodes: Node[]) {
    for (let index = 0; index < nodes.length; index++) {
      const currentNode = nodes[index]
      const isNodeOnYes = yesXAxis === currentNode.position.x
      if (!isNodeOnYes) {
        chainOfChildrens.push(currentNode)
        transverse([...getOutgoers(currentNode, initialElements)])
      }
    }
  })(getOutgoers(node, initialElements))

  return chainOfChildrens
}

export function getChildElementsOfYes(node: Node, initialElements: Elements) {
  const chainOfChildrens: any[] = []
  const yesXAxis = node.position.x

  ;(function transverse(nodes: Node[]) {
    for (let index = 0; index < nodes.length; index++) {
      const currentNode = nodes[index]
      const isNodeOnYes = yesXAxis === currentNode.position.x
      if (isNodeOnYes) {
        chainOfChildrens.push(currentNode)
        transverse([...getOutgoers(currentNode, initialElements)])
      }
    }
  })(getOutgoers(node, initialElements))
  return chainOfChildrens
}

function getLeafNodes(node: Node, initialElements: Elements) {
  const leafNodes = []
  ;(function transverse(nodes: Node[]) {
    // child of the dropped element branch

    for (let index = 0; index < nodes.length; index++) {
      const currentNode = nodes[index]
      if (!getOutgoers(currentNode, initialElements).length) {
        leafNodes.push(currentNode)
      } else {
        transverse([...getOutgoers(currentNode, initialElements)])
      }
    }
  })(getOutgoers(node, initialElements))
  return leafNodes
}

export function getChildNodes(node: Node, initialElements: Elements, dragOverElement?: any) {
  let chainOfChildrens: Node[] = []
  ;(function transverse(nodes: Node[]) {
    // child of the dropped node branch
    const nodeChild = nodes.find((node: Node) => node.id === dragOverElement?.target)
    for (let index = 0; index < nodes.length; index++) {
      if (nodes.length > 1 && nodeChild) {
        chainOfChildrens.push(nodeChild)
        transverse(getOutgoers(nodeChild, initialElements))
        break
      } else {
        chainOfChildrens.push(nodes[index])
        transverse([...getOutgoers(nodes[index], initialElements)])
      }
    }
  })(getOutgoers(node, initialElements))
  return chainOfChildrens
}

export const getMaxXPosition = (elements: Node[]): number => {
  return Math.max(...elements.map((el: Node) => el.position.x))
}

export const getMaxYPosition = (elements: Node[]): number => Math.max(...elements.map((el: Node) => el.position.y))

export const getLevelX = (x: number): number => {
  return (x - INITIAL_X_POSITION) / fragmentX
}
function getUniqueObjects(array1: Node[], array2: Node[]) {
  const uniqueElements = array2.filter((element) => !array1.some((item) => item.id === element.id))
  return uniqueElements
}

function getCollisionNode(previous: Node[], newNodes: Node[]) {
  function isIntersectOnAxisX(prevItem: Node, newElement: Node) {
    return prevItem.position.x === newElement.position.x && prevItem.position.y <= newElement.position.y + fragmentY
  }
  const nodesThatCollidesOnAxisX = newNodes.filter((newElement) =>
    previous.some((prevItem) => isIntersectOnAxisX(prevItem, newElement)),
  )
  function isIntersectOnAxisY(prevItem: Node, newElement: Node) {
    return prevItem.position.y + fragmentY >= newElement.position.y
  }

  const nodesThatCollides = previous.filter((prevItem) =>
    nodesThatCollidesOnAxisX.some((possibleCollision) => isIntersectOnAxisY(prevItem, possibleCollision)),
  )
  return nodesThatCollides
}

function getChildElOnSameAxis(node: Node, elements: Node[]) {
  return elements.filter((el) => node.position.x <= el.position.x)
}
function isChildNodesCollide(node: Node, initialElements: Elements): boolean {
  // checks the collision of next 2 descendants on the same x axios
  const nodeNoChildElement = getChildElementsOfNo(node, initialElements).pop()
  const nodeYesChildElement = getChildElementsOfYes(node, initialElements).shift()
  if (nodeYesChildElement?.data?.type === branchType && nodeNoChildElement) {
    const grandsonNode = getChildElementsOfNo(nodeYesChildElement, initialElements).pop()
    const isGrandsonChildIntersect = grandsonNode ? getCollisionNode([grandsonNode], [nodeNoChildElement]) : []

    return isGrandsonChildIntersect.length ? true : false
  }
  return false
}
export function getBranchFirstNoNode(node: Node, initialElements: Elements) {
  const yesXAxis = node.position.x
  const childElements = getOutgoers(node, initialElements)
  const noFirstChild = childElements.find((element) => element.position.x !== yesXAxis)
  return noFirstChild
}

export function getNoBranchEndNode(node: Node, elements: Elements) {
  const firstNoNode = getBranchFirstNoNode(node, elements)
  const mainNoXAxis = firstNoNode?.position.x

  let result
  ;(function transverse(nodes: Node[]) {
    for (let index = 0; index < nodes.length; index++) {
      const currentNode = nodes[index]
      if (mainNoXAxis === currentNode.position.x) {
        if (!getOutgoers(currentNode, elements).length) {
          result = currentNode
        }
        transverse([...getOutgoers(currentNode, elements)])
      }
    }
  })(getOutgoers(node, elements))

  return result
}
export function isCollideOnYAxis(topBranchY: number, bottomBranchY: number): boolean {
  return topBranchY + 2 * fragmentY > bottomBranchY
}
export function decreaseParentBranchX(info: { parentNode: Node; elements: Elements; prevNode: Node }) {
  const { parentNode, elements, prevNode } = info
  const isOnSameAxisPrevAndParent = parentNode.position.x === prevNode.position.x

  if (!isOnSameAxisPrevAndParent) {
    return
  }

  const prevBranchChildrens = getChildElementsOfNo(prevNode, elements)
  const parentBranchChildrens = getChildElementsOfNo(parentNode, elements)
  const parentChildLvl = getLevelX(parentBranchChildrens[0]?.position.x)
  const prevElementLvl = prevBranchChildrens.length
    ? getLevelX(prevBranchChildrens[prevBranchChildrens.length - 1].position.x)
    : getLevelX(prevNode.position.x)

  const multiplierParent = prevElementLvl - parentChildLvl + 1
  const { parentBranch, childBranch } = getSiblingsYAxisBranches(prevNode, elements)

  if (parentBranch && childBranch) {
    const parentBranchEndNode = getNoBranchEndNode(parentBranch, elements)
    const childBranchFirstNoNode = getBranchFirstNoNode(childBranch, elements)
    const canCollideOnYAxis =
      childBranchFirstNoNode && parentBranchEndNode
        ? isCollideOnYAxis(parentBranchEndNode.position.y, childBranchFirstNoNode.position.y)
        : true

    if (!canCollideOnYAxis) {
      const updatedNodes = updateXPosition(parentBranchChildrens, multiplierParent)
      return updatedNodes
    }
  }
}

export function updateParentIfPosition(node: Node, initialElements: Elements) {
  let elements = [...initialElements]
  let counter = 0
  const initialLeafNodes = getLeafNodes(node, elements)
  let prevNode = node
  ;(function traversalParents(nodes: Node[]) {
    const parentNode = nodes[0]
    const shouldMoveParent = isChildNodesCollide(node, elements)

    if (parentNode) {
      if (parentNode?.data?.type === branchType) {
        // GET parent elements childs
        const currentNodeChildElements = getChildElementsOfNo(parentNode, elements)
        const parentLeafs = getLeafNodes(parentNode, elements)
        const parentUniqueLeafs = getUniqueObjects(initialLeafNodes, parentLeafs)
        const collidesParentNode = getCollisionNode(initialLeafNodes, parentUniqueLeafs)
        if (!collidesParentNode.length) {
          initialLeafNodes.push(...parentUniqueLeafs)
        }

        if (shouldMoveParent || collidesParentNode.length) {
          // Update parent element childs position according to the size of the current element
          const childElementsOnTheSameAxis = collidesParentNode.length
            ? getChildElOnSameAxis(collidesParentNode[0], currentNodeChildElements)
            : []
          const isMovingChildElementsOnSameAxis = !!childElementsOnTheSameAxis?.length
          const isMovingChildElements =
            !!childElementsOnTheSameAxis?.length || parentNode.position.x === node.position.x

          let increasedXParent: Node<any>[] = []

          if (isMovingChildElements) {
            increasedXParent = updateXPosition(currentNodeChildElements)
          }
          if (isMovingChildElementsOnSameAxis) {
            // separate the elements that has to move, moving only the same elements on x axis
            increasedXParent = updateXPosition(childElementsOnTheSameAxis)
          }

          initialLeafNodes.push(...increasedXParent)

          let res: FlowElement<any>[] = elements.map((el) => {
            let updatedElement = increasedXParent.find((updatedEl) => updatedEl.id === el.id)
            return updatedElement ? { ...el, ...updatedElement } : el
          })

          elements = [...res]
        }
        // update parent child elements in case there is space
        if (node.data.type !== branchType) {
          // if the dropped node is a branch there is treated the case
          const updatedNodes = decreaseParentBranchX({
            parentNode,
            prevNode,
            elements,
          })
          if (updatedNodes) {
            let againUpdated: Elements = elements.map((el) => {
              let updatedElement = updatedNodes.find((updatedEl) => updatedEl.id === el.id)
              return updatedElement ? { ...el, ...updatedElement } : el
            })
            elements = [...againUpdated]
          }
        }

        prevNode = { ...parentNode }
      }

      traversalParents([...getIncomers(parentNode, elements)])
    }
  })(getIncomers(node, elements))
  /*   check child elements */
  ;(function traversalChildrens(nodes: Node[]) {
    counter++
    const parentNode = nodes[0]
    if (parentNode) {
      if (parentNode?.data?.type === branchType) {
        // GET parent element childs
        const childElements = getChildElementsOfNo(parentNode, elements)
        const currentNodeChildElements = getChildElementsOfNo(node, elements)

        const isIntersecting = childElements.length >= counter
        const isOnSamexAxis = node.position.x === parentNode.position.x

        // Update parent element childs position according to the size of the current element
        if (isIntersecting && isOnSamexAxis && currentNodeChildElements.length) {
          const maxPositionXChild = getMaxXPosition(childElements)
          const maxPositionXParent = getMaxXPosition(currentNodeChildElements)
          const childLvl = getLevelX(maxPositionXChild)
          const parentLvl = getLevelX(maxPositionXParent)
          const childParentlvlDifference = childLvl - parentLvl + 1
          const increasedXParent = updateXPosition(currentNodeChildElements, childParentlvlDifference)
          let res: FlowElement<any>[] = elements.map((el) => {
            let updatedElement = increasedXParent.find((updatedEl) => updatedEl.id === el.id)
            return updatedElement ? { ...el, ...updatedElement } : el
          })

          elements = [...res]
        }
      }

      traversalChildrens([...getOutgoers(parentNode, elements)])
    }
  })(getOutgoers(node, elements))
  return elements
}
/**
 * Function that updates node's x position based on a multiplier
 * @param    {Node[]} nodes - Nodes that you want to update.
 * @param    {number} multiplier - the value of units (on x axis) you want to update.
 * @return   {Node[]} - The nodes with updated position x value.
 */
export function updateXPosition(nodes: Node[], multiplier: number = 1): Node[] {
  const updatedXNodes = [...nodes].map((node: Node) => {
    const updatedPosition = {
      x: node.position.x + fragmentX * multiplier,
      y: node.position.y,
    }

    const updatedNode = { ...node, position: updatedPosition }
    return updatedNode
  })
  return updatedXNodes
}
/**
 * Function that updates node's x position based on a multiplier
 * @param    {Node[]} nodes - Nodes that you want to update.
 * @param    {number} multiplier - the value of units (on Y axis) you want to update.
 * @return   {Node[]} - The nodes with updated position Y value.
 */
export function updateYPosition(nodes: Node[], multiplier: number = 1): Node[] {
  const updatedYNodes = [...nodes].map((node: Node) => {
    const updatedPosition = {
      x: node.position.x,
      y: node.position.y + fragmentY * multiplier,
    }

    const updatedNode = { ...node, position: updatedPosition }
    return updatedNode
  })
  return updatedYNodes
}

export const moveElementsPosition = (elements: Elements, dragOverElementId: any, goDown: boolean) => {
  const parentElement = getElementById(elements, dragOverElementId.source) as Node
  const childElements = getChildNodes(parentElement, elements, dragOverElementId)
  const idOfElementsThatNeedsUpdate = childElements.map((element) => element.id)

  const updatedElements = [...elements].map((el: any) => {
    if (idOfElementsThatNeedsUpdate.includes(el.id)) {
      const updatedPosition = {
        x: el.position.x,
        y: el.position.y + (goDown ? fragmentY : -fragmentY),
      }
      const element = { ...el, position: updatedPosition }
      return element
    }

    return el
  })
  return updatedElements
}

/**
 * Function that gets the parent branch node of a specific node
 * @param    {Node} node - Node that you are looking for parent.
 * @param    {Elements} elements - Elements where the parent can be.
 * @return   {Node | undefined} - Parent branch if there is one or undefined.
 */
export function getParentBranchNode(node: Node, elements: Elements): Node | undefined {
  let parentBranchNode
  ;(function transverse(nodes: Node[]) {
    const parentNode = nodes[0]
    if (parentNode) {
      if (parentNode?.data?.type === branchType) {
        parentBranchNode = { ...parentNode }
        return parentBranchNode
      }
      transverse([...getIncomers(parentNode, elements)])
    }
  })(getIncomers(node, elements))

  return parentBranchNode
}
/**
 * Function that gets the child branch node of a specific node
 * @param    {Node} node - Node that you are looking for child node.
 * @param    {Elements} elements - Elements where the child node can be.
 * @return   {Node | undefined} - Child branch if there is one or undefined.
 */
export function getChildBranchNode(node: Node, elements: Elements): Node | undefined {
  let childBranchNode
  ;(function transverse(nodes: Node[]) {
    const childNode = nodes[0]

    if (childNode) {
      if (childNode?.data?.type === branchType) {
        childBranchNode = childNode
        return childBranchNode
      }

      transverse([...getOutgoers(childNode, elements)])
    }
  })(getOutgoers(node, elements))

  return childBranchNode
}
/**
 * Function that gets the siblings branches (on X axis)
 * @param    {Node} node - Node that you are looking for siblings branches.
 * @param    {Elements} elements - Elements where the siblings branches can be.
 * @return   { parentBranch: Node | undefined; childBranch: Node | undefined } - The parent branch (upper branch) and child branch (lower branch) on x-axis if there is one or undefined.
 */
export function getSiblingsYAxisBranches(
  node: Node,
  elements: Elements,
): { parentBranch: Node | undefined; childBranch: Node | undefined } {
  const parentBranch = getParentBranchNode(node, elements)
  const childBranch = getChildBranchNode(node, elements)
  return { parentBranch, childBranch }
}

/**
 * Function that gets the siblings nodes (on X axis)
 * @param    {Node} node - Node that you are looking for siblings nodes.
 * @param    {Elements} elements - Elements where the siblings nodes can be.
 * @return   { parentNode: Node; childNode: Node } - The parent node (upper node) and child node (lower node) on x-axis if there is one or undefined.
 */
export function getSiblingsYAxisNodes(node: Node, elements: Elements): { parentNode: Node; childNode: Node } {
  const parentNode = getIncomers(node, elements)[0]
  const childNode = getOutgoers(node, elements)[0]
  return { parentNode, childNode }
}
