import { isNode, isEdge, Node, Edge } from 'react-flow-renderer'

import { getElementsAfterDeleteNode } from './SegmentUtils'
import * as mocks from './mocks'

describe('Remove basic node', () => {
  it('should remove the node and update the child nodes position', () => {
    const nodes = mocks.removeNodesInitial.filter((el) => isNode(el)) as Node[]
    const edges = mocks.removeNodesInitial.filter((el) => isEdge(el)) as Edge[]
    const newState = getElementsAfterDeleteNode('5', nodes, edges)

    expect(newState).toEqual(mocks.elementsAfterRemoving5)
  })
})

describe('Remove branch node', () => {
  it('should remove the branch and all his child nodes', () => {
    const nodes = mocks.neastedBranches.filter((el) => isNode(el)) as Node[]
    const edges = mocks.neastedBranches.filter((el) => isEdge(el)) as Edge[]
    const newState = getElementsAfterDeleteNode('5', nodes, edges)

    expect(newState).toEqual(mocks.neastedBranchesAfterRemoveFirstBranch)
  })
})
