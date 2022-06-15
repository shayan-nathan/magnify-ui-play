import { API } from 'api/api'
import { BuilderAction, shapeType } from 'components/PlaybookBuilder/PlaybookBuilderTypes'
import { makeAutoObservable, runInAction } from 'mobx'
import { Elements, FlowElement } from 'react-flow-renderer'

import { Playbook, Playbooks, PlaybookUpdate } from 'models/playbook.model'

const initCurrentPlaybook = {
  version: 1,
  numSteps: 0,
  tenantId: '1',
  createdAt: 1647267466090,
  stateMachineArn:
    'arn:aws:states:us-west-2:495303562198:stateMachine:ea946355-4553-4914-a288-48e025f43c1e_version_1_stateMachine',
  lastUpdatedAt: 1647267466090,
  createdBy: 'daniel.furtuna@assist.ro',
  integrations: ['string'],
  playbookId: 'ea946355-4553-4914-a288-48e025f43c1e',
  dsl: {
    title: 'Increase someting DSL',
    startAt: 'segments1',
    states: {
      segments1: {
        type: 'segment',
        end: true,
        description: 'Segment description',
        payload: {},
      },
    },
  },
  currState: 'DRAFT',
  title: 'Increase adoption: General ledger integration',
  goal: 'test goal',
}
export class PlaybookStore {
  elements: Elements = []
  newElements: Elements = []
  isLoading = true
  displayEdgeDrops = false
  placeholderShape: shapeType | string = 'circle'
  dragOverElement: BuilderAction | null = null
  droppedElement: BuilderAction | null = null
  playbooks: Playbooks = { data: [] }
  currentPlaybook: Playbook | null = null

  constructor() {
    makeAutoObservable(this)
  }
  setDropedElement = (element: BuilderAction | null) => {
    this.droppedElement = element
  }
  setDragOverElement = (element: BuilderAction) => {
    this.dragOverElement = element
  }

  remove = async (element: FlowElement): Promise<void> => {
    const sourceIndex = this.elements.findIndex((el) => el.id === element.id)
    if (sourceIndex) {
      this.elements.splice(sourceIndex, 1)
    }
  }
  get = async (data: PlaybookUpdate): Promise<void> => {
    this.isLoading = true
    const newPlaybook = await API.playbooks.get(data)
    runInAction(() => {
      this.currentPlaybook = newPlaybook
      this.isLoading = false
    })
  }
  initCurrentPlaybook = () => {
    this.currentPlaybook = initCurrentPlaybook
  }
  // update = (element: FlowElement): void => {
  //   let el = this.elements.find((el) => el.id === element.id)
  //   if (el) {
  //     const indexOfupdate = this.elements.indexOf(el)
  //     this.elements.splice(indexOfupdate, 1, element)
  //   }
  // }
  setDisplayEdgeDrops = (value: boolean) => {
    this.displayEdgeDrops = value
  }
  setPlaceholderShape = (shape: shapeType | string) => {
    this.placeholderShape = shape
  }

  post = async (playbook: any): Promise<any> => {
    const newPlaybook = await API.playbooks.post(playbook)
    this.isLoading = true
    runInAction(() => {
      this.isLoading = false
    })
    return newPlaybook
  }

  getAll = async (): Promise<void> => {
    this.isLoading = true
    const playbooks = await API.playbooks.getAll()
    runInAction(() => {
      this.playbooks = playbooks
      this.isLoading = false
    })
  }

  // TODO: fix it
  update = async (playbook: any, action?: string): Promise<void> => {
    this.isLoading = true
    const updatedPlaybook = await API.playbooks.update(playbook, action)

    runInAction(() => {
      // this.playbooks = updatedPlaybook
      if (action === 'clone') {
        this.playbooks.data.unshift(updatedPlaybook)
      }
      this.isLoading = false
    })
  }
  clone = async (playbook: any): Promise<void> => {
    this.isLoading = true
    const updatedPlaybook = await API.playbooks.clone(playbook)

    runInAction(() => {
      this.playbooks.data.unshift(updatedPlaybook)
      this.isLoading = false
    })
  }

  execute = async (playbook: PlaybookUpdate): Promise<void> => {
    await API.playbooks.execute(playbook)
  }

  // remove = async (playbook: any): Promise<void> => {
  //   const removePlaybook = await API.users.remove(playbook.playbookId)
  //   const playbookIndex = this.playbooks.message.findIndex((item) => item.playbookId === playbook.playbookId)
  //   if (removePlaybook) {
  //     this.playbooks.message.splice(playbookIndex, 1)
  //   }
  // }
}
