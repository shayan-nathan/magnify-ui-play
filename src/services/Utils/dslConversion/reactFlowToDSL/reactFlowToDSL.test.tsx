import { toCamelCase } from 'services/Utils/parseString.utils'
import * as allUtils from './reactFlowToDSL'

import * as mocks from './reactFlowToDSL.mock'

describe('Get UI structure and convert to DSL', () => {
  it('should return the DSL for the initial state', () => {
    const initialDSL = allUtils.reactFlowToDLS(mocks.initialElements)
    expect(initialDSL).toEqual(mocks.initialElementsDSL)
  })

  it('should return the DSL for elements With Child If', () => {
    const convertedDSL = allUtils.reactFlowToDLS(mocks.elementsWithChildIf)
    expect(convertedDSL).toEqual(mocks.elementsWithChildIfDSL)
  })

  it('should return the DSL for complex elements', () => {
    const complexDSL = allUtils.reactFlowToDLS(mocks.complexFlow)
    expect(complexDSL).toEqual(mocks.complexFlowDSL)
  })

  it('should return the DSL for more complex elements', () => {
    const moreComplexDSL = allUtils.reactFlowToDLS(mocks.moreComplexFlow)
    expect(moreComplexDSL).toEqual(mocks.moreComplexFlowDSL)
  })
  it('should convert to camelCase a string', () => {
    const stringWithSpaces = toCamelCase('a sda asdas')
    expect(stringWithSpaces).toEqual('aSdaAsdas')

    const stringWithUnderscores = toCamelCase('Update_lead')
    expect(stringWithUnderscores).toEqual('updateLead')

    const stringWithUnderscoresAndNumbers = toCamelCase('Update_lead_03')
    expect(stringWithUnderscoresAndNumbers).toEqual('updateLead03')

    const stringWithSpecialCaracters = toCamelCase('If / Else')
    expect(stringWithSpecialCaracters).toEqual('ifElse')
  })
})
