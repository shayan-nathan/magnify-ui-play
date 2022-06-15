import { PlaybookActionsType } from '../../PlaybookBuilderTypes'

// Monst likely this will be an hardcoded object all the time because will always be a limited amount of operations
export const playbookBuilderOptions: PlaybookActionsType = {
  targeting: [{ name: 'Segments', type: 'segment', shape: 'circle' }],
  rules: [
    { name: 'If / Else', type: 'if_else', shape: 'rhomb' },
    { name: 'Wait for trigger', type: 'wait_for_trigger', shape: 'rhomb' },
    { name: 'Time delay', type: 'time_delay', shape: 'rhomb' },
    { name: 'Loop', type: 'loop', shape: 'rhomb' },
  ],
  actions: [
    {
      name: 'Salesforce',
      type: 'platform',
      actions: [
        { name: 'Update lead', type: 'update_lead', shape: 'square' },
        { name: 'Send email', type: 'send_email', shape: 'square' },
        { name: 'Create opportunity', type: 'create_opportunity', shape: 'square' },
      ],
    },
    {
      name: 'Marketo',
      type: 'platform',
      actions: [
        { name: 'Update lead', type: 'update_lead', shape: 'square' },
        { name: 'Send email', type: 'send_email', shape: 'square' },
        { name: 'Create opportunity', type: 'create_opportunity', shape: 'square' },
      ],
    },
    {
      name: 'Pendo',
      type: 'platform',
      actions: [
        { name: 'In-APP notification', type: 'notification', shape: 'square' },
        { name: 'In-APP alert', type: 'alert', shape: 'square' },
        { name: 'Send email', type: 'send_email', shape: 'square' },
      ],
    },
    {
      name: 'Zendesk',
      type: 'platform',
      actions: [
        { name: 'Create ticket', type: 'create_opportunity', shape: 'square' },
        { name: 'Update ticket', type: 'update_lead', shape: 'square' },
      ],
    },
    {
      name: 'Slack',
      type: 'platform',
      actions: [
        { name: 'Add contact', type: 'add_contact', shape: 'square' },
        { name: 'Create a group', type: 'add_contact', shape: 'square' },
        { name: 'Send message', type: 'send_message', shape: 'square' },
      ],
    },
  ],
}
