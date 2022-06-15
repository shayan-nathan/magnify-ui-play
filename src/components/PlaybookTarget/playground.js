/* eslint-disable prettier/prettier */
const SizePadding = 150
const nodes = [
  {
    id: '1',
    type: 'segment',
    data: { isInitial: true, name: 'Segment' },
    position: { x: 250, y: 50 },
  },
  {
    id: '3',
    type: 'segment',
    data: { isInitial: false, name: 'IFElse' },
    position: { x: 250, y: 260 },
  },
  {
    id: '999',
    type: 'end',
    data: { isFinal: true },
    position: { x: 250, y: 480 },
  },
]

const initialElements = [
  {
    id: '1',
    type: 'segment',
    data: { isInitial: true, name: 'Segment' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'custom',
    sourceHandle: 's-bottom',
    targetHandle: 't-top',
    data: { testData: 'Anything we want' },
    arrowHeadType: 'arrow',
    style: { stroke: '#000' },
  },
  {
    id: '3',
    type: 'segment',
    data: { isInitial: false, name: 'IFElse' },
    position: { x: 250, y: 260 },
  },
  {
    id: 'e3-999',
    source: '3',
    target: '999',
    type: 'custom',
    sourceHandle: 's-bottom',
    targetHandle: 't-top',
    data: { testData: 'Anything we want' },
    arrowHeadType: 'arrow',
    style: { stroke: '#000' },
  },
  {
    id: '999',
    type: 'end',
    data: { isFinal: true },
    position: { x: 250, y: 480 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'custom',
    sourceHandle: 's-right',
    targetHandle: 't-top',
    data: { testData: 'Anything we want' },
    arrowHeadType: 'arrow',
    style: { stroke: '#000' },
  },
  {
    id: '4',
    type: 'segment',
    data: { isInitial: false },
    position: { x: 550, y: 480 },
  },
  {
    id: 'e4-998',
    source: '4',
    target: '998',
    type: 'custom',
    sourceHandle: 's-bottom',
    targetHandle: 't-top',
    data: { testData: 'Anything we want' },
    arrowHeadType: 'arrow',
    style: { stroke: '#000' },
  },
  {
    id: '998',
    type: 'end',
    data: { isFinal: true },
    position: { x: 550, y: 680 },
  },
]

function updatePosition(elements, increase = true, right = false) {
  return elements.map((element) => {
    const position = {
      x: right ? element.position.x + 2 * SizePadding : element.position.x,
      y: increase ? element.position.y + SizePadding : element.position.y - SizePadding,
    }
    return { ...element, position }
  })
}

// console.log('zzz', updatePosition(nodes))

var test = [
  { id: '3', type: 'segment' },
  { id: '2', type: 'segment' },
  { id: '6', type: 'segment' },
]

var arrayOfIds = test.map((element) => element.id)

console.log('arrayOfIds', arrayOfIds)
