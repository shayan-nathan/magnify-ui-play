export const dataSource = [
  {
    name: 'Salesforce',
    type: 'platform',
    fieldType: 'attributes',
    categories: [{ name: 'Attributes' }],
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
              { name: 'Child 2 lv2', type: 'field', fields: [] },
            ],
          },
        ],
      },
      {
        name: 'Contacts',
        type: 'PRE-BUILT LISTS',
        fields: [
          {
            name: 'Type',
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
        ],
      },
    ],
  },
  { name: 'Zuara', type: 'platform', fields: [{ name: 'Lead', fields: [{ name: 'Type' }] }] },
  { name: 'Google Analytics', type: 'platform', fields: [{ name: 'Lead', fields: [{ name: 'Type' }] }] },
  {
    name: 'Marketo',
    type: 'platform',
    fields: [
      { name: 'Attributes', fields: [{ name: 'Type' }] },
      { name: 'Pre build', fields: [{ name: 'Type' }] },
    ],
  },
]
