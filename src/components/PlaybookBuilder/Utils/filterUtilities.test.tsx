import { filterActions } from './filterUtils'
import { playbookBuilderOptions } from '../PlaybookSidebar/Settings/PlaybookBuilder.settings'

describe('filterActions utilities', () => {
  it('filter by "loop" keyword', () => {
    expect(filterActions(playbookBuilderOptions, 'loop')).toEqual({
      targeting: [],
      rules: [{ name: 'Loop', type: 'loop', shape: 'rhomb' }],
      actions: [
        { name: 'Salesforce', type: 'platform', actions: [] },
        { name: 'Marketo', type: 'platform', actions: [] },
      ],
    })
  })

  it('filter by "update" keyword', () => {
    expect(filterActions(playbookBuilderOptions, 'update')).toEqual({
      targeting: [],
      rules: [],
      actions: [
        {
          name: 'Salesforce',
          type: 'platform',
          actions: [{ name: 'Update lead', type: 'update_lead', shape: 'square' }],
        },
        { name: 'Marketo', type: 'platform', actions: [{ name: 'Update lead', type: 'update_lead', shape: 'square' }] },
      ],
    })
  })

  it('filter by "somethingRandom" keyword', () => {
    expect(filterActions(playbookBuilderOptions, 'somethingRandom')).toEqual({
      targeting: [],
      rules: [],
      actions: [
        {
          name: 'Salesforce',
          type: 'platform',
          actions: [],
        },
        { name: 'Marketo', type: 'platform', actions: [] },
      ],
    })
  })

  it('filter by "" (nothing) keyword', () => {
    expect(filterActions(playbookBuilderOptions, '')).toEqual(playbookBuilderOptions)
  })
})
