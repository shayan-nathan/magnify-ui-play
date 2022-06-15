import * as allUtils from './playbookTargetUtils'
import * as incrementModule from './IncrementNodeId'
import * as mocks from './mocks'

let id = 4
const getIdMockFunction = (): string => `${++id}`

describe('playbook target utilities adding element', () => {
  beforeEach(() => (id = 4))

  it('add a basic Segment action element', () => {
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)
    const updatedPosition = allUtils.moveElementsPosition(mocks.initialElements, mocks.edgeDropDataSegment, true)
    const newStateElements = allUtils.addNode(updatedPosition, mocks.edgeDropDataSegment, {})
    expect(newStateElements).toEqual(mocks.expectedElementsAfterAddingBasicOne)
  })

  it('add a basic Segment and an if/else action element after segment', () => {
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)
    const updatedPositionSegment = allUtils.moveElementsPosition(mocks.initialElements, mocks.edgeDropDataSegment, true)
    const newStateElementsAfterSegment = allUtils.addNode(updatedPositionSegment, mocks.edgeDropDataSegment, {})

    expect(newStateElementsAfterSegment).toEqual(mocks.expectedElementsAfterAddingBasicOne)

    const updatedPosition = allUtils.moveElementsPosition(
      newStateElementsAfterSegment,
      mocks.edgeDropDataCondition,
      true,
    )
    const newStateElements = allUtils.addNode(updatedPosition, mocks.edgeDropDataCondition, {})
    expect(newStateElements).toEqual(mocks.expectedNodesAfterAddingBasicOneAndIf)
  })

  it('add two if/else', () => {
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)
    const updatedPositionFirst = allUtils.moveElementsPosition(
      mocks.initialElements,
      mocks.edgeDropDataFirstCondition,
      true,
    )

    const stateAfterFirstIfWasAdded = allUtils.addNode(updatedPositionFirst, mocks.edgeDropDataFirstCondition, {})
    const updatedPositionSecond = allUtils.moveElementsPosition(
      stateAfterFirstIfWasAdded,
      mocks.edgeDropDataSecondCondition,
      true,
    )
    const finalState = allUtils.addNode(updatedPositionSecond, mocks.edgeDropDataSecondCondition, {})

    expect(finalState).toEqual(mocks.expectedElementsAfterAddingSecondIf)
  })
})

describe('playbook utilities adding elements', () => {
  it('check getChildElements', () => {
    const childElements = allUtils.getChildNodes(
      {
        id: '1',
        type: 'segment',
        data: { isInitial: true, name: 'Segments', shape: 'circle' },
        position: { x: 250, y: 50 },
      },
      mocks.expectedElementsAfterAddingBasicOne,
      mocks.edgeDropDataSegment,
    )
    expect(childElements).toEqual(mocks.childNodesOfSegment)
  })

  it('check getParentBranchNode', () => {
    const parentBranchNode = allUtils.getParentBranchNode(
      {
        id: '9',
        type: 'segment',
        data: {
          id: 'e8-999',
          source: '8',
          target: '999',
          data: { edgeLabel: 'yes' },
          name: 'Time delay',
          type: 'time_delay',
          shape: 'rhomb',
        },
        position: { x: 250, y: 560 },
      },
      mocks.elementsWithParentIf,
    )
    expect(parentBranchNode).toEqual({
      data: {
        data: { edgeLabel: 'yes' },
        id: 'e1-999',
        name: 'If / Else',
        shape: 'rhomb',
        source: '1',
        target: '999',
        type: 'if_else',
      },
      id: '5',
      position: { x: 250, y: 220 },
      type: 'segment',
    })
  })

  it('check getChildBranchNode', () => {
    const childBranchNode = allUtils.getChildBranchNode(
      {
        id: '9',
        type: 'segment',
        data: {
          id: 'e1-8',
          source: '1',
          target: '8',
          data: { edgeLabel: 'yes' },
          name: 'If / Else',
          type: 'if_else',
          shape: 'rhomb',
        },
        position: { x: 250, y: 220 },
      },
      mocks.elementsWithChildIf,
    )
    expect(childBranchNode).toEqual({
      id: '5',
      type: 'segment',
      data: {
        id: 'e1-999',
        source: '1',
        target: '999',
        data: { edgeLabel: 'yes' },
        name: 'If / Else',
        type: 'if_else',
        shape: 'rhomb',
      },
      position: { x: 250, y: 560 },
    })
  })
})

describe('updateParentIfPosition utilities', () => {
  it('should  return the maximum x position of elements', () => {
    const Xmax = allUtils.getMaxXPosition(mocks.complexNodes)
    expect(Xmax).toBe(890)
    const XmaxInitial = allUtils.getMaxXPosition(mocks.childNodesOfSegment)
    expect(XmaxInitial).toBe(250)
  })
})

describe('complex if/else scenarios', () => {
  it('should move the first branch childrens to right when is added to second branch another if/else that colides with the top branch', () => {
    const lastElementIndex = 9
    id = lastElementIndex
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)

    const updatedPositionSegment = allUtils.moveElementsPosition(
      mocks.twoIfsWithCollisionPosibility,
      mocks.edgeDropDataConditionOnChild,
      true,
    )

    const newStateElementsAfterAddingTheIf = allUtils.addNode(
      updatedPositionSegment,
      mocks.edgeDropDataConditionOnChild,
      {},
    )

    expect(newStateElementsAfterAddingTheIf).toEqual(mocks.elementsStateWithCollisionAfterAddingAnotherIf)
  })

  it('should move the first branch childrens to right when is added elements colides with another branch', () => {
    const lastElementIndex = 9
    id = lastElementIndex
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)

    const updatedPositionSegment = allUtils.moveElementsPosition(
      mocks.intialTopBottomCollide,
      mocks.edgeDropDataTopBottomCloide,
      true,
    )

    const newStateElementsAfterAddingTheIf = allUtils.addNode(
      updatedPositionSegment,
      mocks.edgeDropDataTopBottomCloide,
      {},
    )

    expect(newStateElementsAfterAddingTheIf).toEqual(mocks.elementsStateWithInitialTopBottomClollide)
  })
})

describe('complex if/else decrase parent elements X axis having siblings if else branches', () => {
  it('should move the first branch childrens to left if is dropped a normal node and it can not collide with other branches', () => {
    const lastElementIndex = 8
    id = lastElementIndex
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)

    const updatedPositionSegment = allUtils.moveElementsPosition(
      mocks.basicConsecutiveBranches,
      mocks.edgeDropDataDelayBetWeenTwoIfs,
      true,
    )

    const newStateElementsAfterAddingTheIf = allUtils.addNode(
      updatedPositionSegment,
      mocks.edgeDropDataDelayBetWeenTwoIfs,
      {},
    )

    expect(newStateElementsAfterAddingTheIf).toEqual(mocks.elementsStateAfterAddingDelay)
  })

  it('should not move the top branch childrens to right when is added a normal node and it can collide with the below branch', () => {
    const lastElementIndex = 9
    id = lastElementIndex
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)

    const updatedPositionSegment = allUtils.moveElementsPosition(
      mocks.consecutiveBranchesWithTopBranchWithOneChild,
      mocks.edgeDropDataDelayBetWeenTwoIfs,
      true,
    )

    const newStateElementsAfterAddingTheIf = allUtils.addNode(
      updatedPositionSegment,
      mocks.edgeDropDataDelayBetWeenTwoIfs,
      {},
    )

    expect(newStateElementsAfterAddingTheIf).toEqual(mocks.consecutiveBranchesWithTopBranchWithOneChildAfterAddingDelay)
  })

  it('should move to the left the upper branches when a normal element is dropped below the second branch and there is enought space to avoid collisions', () => {
    const lastElementIndex = 10
    id = lastElementIndex
    jest.spyOn(incrementModule, 'getId').mockImplementation(getIdMockFunction)

    const updatedPositionSegment = allUtils.moveElementsPosition(
      mocks.threeConsecutiveBranches,
      mocks.edgeDropDataDelayBetWeenThreeIfs,
      true,
    )

    const newStateElementsAfterAddingTheIf = allUtils.addNode(
      updatedPositionSegment,
      mocks.edgeDropDataDelayBetWeenThreeIfs,
      {},
    )

    expect(newStateElementsAfterAddingTheIf).toEqual(mocks.expectedResultAfterAddingDelay)
  })
})

describe('Update X position of nodes', () => {
  it('increase Position of nodes with one unit', () => {
    const updatedPositionSegment = allUtils.updateXPosition(mocks.elementsToUpdateX, 1)

    expect(updatedPositionSegment).toEqual(mocks.elementsAfterIncreasingOneUnit)
  })
  it('increase Position of nodes with Two units', () => {
    const updatedPositionSegment = allUtils.updateXPosition(mocks.elementsToUpdateX, 2)

    expect(updatedPositionSegment).toEqual(mocks.elementsAfterIncreasingTwoUnits)
  })

  it('decrese Position of nodes with one unit', () => {
    const updatedPositionSegment = allUtils.updateXPosition(mocks.elementsToUpdateX, -1)

    expect(updatedPositionSegment).toEqual(mocks.elementsAfterDecresingOneUnit)
  })

  it('decrese Position of nodes with Two units', () => {
    const updatedPositionSegment = allUtils.updateXPosition(mocks.elementsToUpdateX, -2)

    expect(updatedPositionSegment).toEqual(mocks.elementsAfterDecresingTwoUnits)
  })
  it('should not change the position if is zero', () => {
    const updatedPositionSegment = allUtils.updateXPosition(mocks.elementsToUpdateX, 0)

    expect(updatedPositionSegment).toEqual(mocks.elementsToUpdateX)
  })
})

describe('Get lvl x position', () => {
  it('should return lvl 0', () => {
    const lvl = allUtils.getLevelX(250)
    expect(lvl).toBe(0)
  })
  it('should return lvl 1', () => {
    const lvl = allUtils.getLevelX(570)
    expect(lvl).toBe(1)
  })

  it('should return lvl 2', () => {
    const lvl = allUtils.getLevelX(890)
    expect(lvl).toBe(2)
  })
})
describe('Get node helpers', () => {
  it('should return the siblings of node', () => {
    const siblingsNodes = allUtils.getSiblingsYAxisNodes(
      {
        id: '5',
        type: 'segment',
        data: {
          id: 'e1-999',
          source: '1',
          target: '999',
          data: { edgeLabel: 'yes' },
          name: 'Wait for trigger',
          type: 'wait_for_trigger',
          shape: 'rhomb',
          iconName: 'wait_for_trigger',
        },
        position: { x: 250, y: 220 },
      },
      mocks.basicElementsInRow,
    )

    expect(siblingsNodes).toEqual({
      parentNode: {
        id: '1',
        type: 'segment',
        data: { isInitial: true, name: 'Segments', shape: 'circle', iconName: 'segment' },
        position: { x: 250, y: 50 },
      },
      childNode: {
        id: '6',
        type: 'segment',
        data: {
          id: 'e5-999',
          source: '5',
          target: '999',
          data: { edgeLabel: 'yes' },
          name: 'Time delay',
          type: 'time_delay',
          shape: 'rhomb',
          iconName: 'time_delay',
        },
        position: { x: 250, y: 390 },
      },
    })
  })
})
