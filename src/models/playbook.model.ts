import { Elements } from 'react-flow-renderer'

import { Item } from 'components/PlaybookBuilder/PlaybookBuilderTypes'

export interface BasePlayboook {
  title: string
  goal: string
  isDynamic?: boolean
}

export interface Dsl {
  startAt: string
  states: States
  comment?: string
  title?: string
}

export interface States {
  [key: string]: NodeState
}

export interface PlaybookUpdate {
  playbookId: string
  version: number
}

export interface Playbook extends BasePlayboook {
  playbookId: string
  version: number
  createdAt: number
  lastUpdatedAt: number
  currState: string
  integrations: any[]
  dsl: Dsl
  numSteps?: number
  tenantId?: string
  createdBy: string
  stateMachineArn?: string
}

export interface Playbooks {
  data: Playbook[]
}

export interface RecursiveTraverse {
  elements: Elements
  nodeId: string | undefined
  states: States
  prevNodeKey?: string
  edgeIndex?: number
}

export interface NodeState {
  type: string
  next?: string
  end?: boolean
  default?: string
  choices?: Choice[]
  payload?: NodePayload
  description?: string
}

export interface Choice {
  next?: string
  end?: boolean
}

export interface RecursiveModel {
  flow: any
  stateName: string
  parentStateName?: string
  isNoBranch?: boolean
}

export interface EdgeOption {
  stateName: string
  parentStateName: string
  end?: boolean
  isNoBranch?: boolean
}

export interface NodePayload {
  groups?: PayloadGroup
}

export interface PayloadGroup {
  groups: Item[]
  relationOperator: string
}
