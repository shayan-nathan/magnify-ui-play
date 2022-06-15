import { mockDataItems } from '../PlaybookBuilderTypes'

export const mockData: mockDataItems[] = [
  {
    name: 'Salesforce',
    type: 'platform',
    fieldType: 'attributes',
    fields: [
      { name: 'Lead', type: 'attribute', fields: [{ name: 'Type' }, { name: 'Stage' }] },
      { name: 'Opportunity', type: 'attribute', fields: [{ name: 'Type' }, { name: 'Stage' }] },
      { name: 'Company', type: 'attribute', fields: [{ name: 'Type' }] },
      { name: 'Demographics', type: 'attribute', fields: [{ name: 'Type' }] },
      {
        name: 'Test child',
        type: 'attribute',
        fields: [
          {
            name: 'Child  1 lvl3',
            type: 'attribute',
            fields: [
              {
                name: 'Child 1 lvl4',
                type: 'attribute',
                fields: [
                  {
                    name: 'Child 1 lvl5',
                    type: 'attribute',
                    fields: [
                      {
                        name: 'Child 1 last',
                        type: 'field',
                        fields: [],
                      },
                      { name: 'Child 2 last', type: 'field', fields: [] },
                    ],
                  },
                  { name: 'Child 2 lvl5', type: 'field', fields: [] },
                ],
              },
              { name: 'Child 2 lvl4', type: 'field', fields: [] },
            ],
          },
          {
            name: 'Child 2 lvl3',
            type: 'attribute',
            fields: [
              {
                name: 'Child 1 lvl4',
                type: 'attribute',
                fields: [
                  {
                    name: 'Child 1 last',
                    type: 'field',
                    fields: [],
                  },
                  { name: 'Child 2 last', type: 'field', fields: [] },
                ],
              },
              { name: 'Child 2 lv2', type: 'attribute', fields: [] },
            ],
          },
        ],
      },
      { name: 'Contacts', type: 'attribute', fields: [{ name: 'Type' }] },
    ],
  },
  { name: 'Zuara', type: 'platform', fields: [{ name: 'Lead', fields: [{ name: 'Type' }] }] },
  { name: 'Google Analytics', type: 'platform', fields: [{ name: 'Lead', fields: [{ name: 'Type' }] }] },
  { name: 'Marketo', type: 'platform', fields: [{ name: 'Lead', fields: [{ name: 'Type' }] }] },
]
