import * as allUtils from './dslToReactFlow'

import * as mocks from './dslToReactFlow.mock'
import * as dslModule from '..'

let idsOfNo = ['11', '999', '7']
const getIdMockFunction = (): string => `${idsOfNo.pop()}`

describe('Get DSL and convert to react flow structure', () => {
  it('should return the react flow structure for the initial state DSL', () => {
    idsOfNo = ['999']
    jest.spyOn(dslModule, 'getRandomId').mockImplementation(getIdMockFunction)
    const reactFlowStructure = allUtils.dlsToReactFlow(mocks.initialElementsDSL)
    expect(reactFlowStructure).toEqual(mocks.initialElements)
    expect(reactFlowStructure.length).toEqual(mocks.initialElements.length)
  })

  it('should return the DSL for elements With Child If', () => {
    idsOfNo = ['11', '999', '7']
    jest.spyOn(dslModule, 'getRandomId').mockImplementation(getIdMockFunction)
    const convertedDSL = allUtils.dlsToReactFlow(mocks.elementsWithChildIfDSL)
    // console.log('convertedDSL', JSON.stringify(convertedDSL))
    expect(convertedDSL).toEqual(mocks.elementsWithChildIf)
  })
  it('should return the DSL for more complex elements', () => {
    idsOfNo = ['23', '16', '16_', '18', '13', '6', '999_', '11']
    jest.spyOn(dslModule, 'getRandomId').mockImplementation(getIdMockFunction)
    const moreComplexDSL = allUtils.dlsToReactFlow(mocks.moreComplexFlowDSL)
    // console.log('moreComplexDSL', JSON.stringify(moreComplexDSL))
    expect(moreComplexDSL).toEqual(mocks.moreComplexFlow)
  })

  // it('should return the flow for two ifs in row', () => {
  //   idsOfNo = ['999', '998', '996']
  //   jest.spyOn(dslModule, 'getRandomId').mockImplementation(getIdMockFunction)
  //   const twoIfs = allUtils.dlsToReactFlow(mocks.twoIfsDSL)
  //   // console.log('twoIfs', JSON.stringify(twoIfs))
  //   expect(twoIfs).toEqual(mocks.twoIfs)
  // })

  // it('should return the DSL for more complex elements', () => {
  //   idsOfNo = ['23', '11_', '16', '18', '13', '6', '999_', '11']
  //   jest.spyOn(dslModule, 'getRandomId').mockImplementation(getIdMockFunction)
  //   const moreComplexDSL = allUtils.dlsToReactFlow(mocks.moreComplexFlowDSL)
  //   console.log('moreComplexDSL', JSON.stringify(moreComplexDSL))
  //   expect(moreComplexDSL).toEqual(mocks.moreComplexFlow)
  // })
})
