import { action, makeAutoObservable, observable, runInAction } from 'mobx'

import { API } from '../api/api'
import {
  SalesforceOportunity,
  ActionPost,
  Connection,
  Integration,
  ConnectionEdit,
  ConnectionPost,
  MarketoAction,
  TrayAuthData,
} from 'models/Integration.model'

export class IntegrationsStore {
  integrations: Integration[] = []
  isLoading = false
  isLoadingActions = false
  trayAuthUrl = ''
  trayUserAccessToken = ''
  currentIntegration: Integration | null = null
  actions: SalesforceOportunity[] = []
  marketoData: MarketoAction = { campaigns: [], leads: [] }

  constructor() {
    makeAutoObservable(this, {
      integrations: observable,
      isLoading: observable,
      currentIntegration: observable,
      trayAuthUrl: observable,
      set: action,
      get: action,
      remove: action,
      post: action,
      getTrayAuthUrl: action,
    })
  }

  set({ integrations, isLoading }: { integrations: Integration[]; isLoading: boolean }): void {
    this.integrations = integrations
    this.isLoading = isLoading
  }

  setTrayAuthUrl = (newUrl: string): void => {
    this.trayAuthUrl = newUrl
  }
  setLoading = (value: boolean) => {
    this.isLoading = value
  }

  getTrayAuthUrl = async (platform: string): Promise<void> => {
    const { authOnlyDialogUrl, userAccessToken } = await API.tray.getAuthUrl(platform)
    runInAction(() => {
      this.setTrayAuthUrl(authOnlyDialogUrl)
      this.trayUserAccessToken = userAccessToken
    })
  }

  get = async (id: string): Promise<void> => {
    this.isLoading = true
    const integration = await API.integrations.get(id)
    runInAction(() => {
      this.currentIntegration = integration
      this.isLoading = false
    })
  }

  getAll = async (): Promise<void> => {
    this.isLoading = true
    const integrations = await API.integrations.getAll()
    runInAction(() => {
      this.integrations = integrations
      this.isLoading = false
    })
  }

  getActions = async (app: string, connectionId: string): Promise<void> => {
    this.isLoadingActions = true
    const actions = await API.integrations.getActionsData(app, connectionId)

    runInAction(() => {
      switch (app) {
        case 'salesforce':
          this.actions = actions
          break
        case 'marketo':
          this.marketoData = actions
          break

        default:
          break
      }
      this.isLoadingActions = false
    })
  }

  removeConnection = async (connectionId: string): Promise<void> => {
    this.isLoading = true
    const removedSource = await API.integrations.remove(connectionId)
    if (this.currentIntegration && removedSource.message === 'SUCCESS!') {
      const sourceIndex = this.currentIntegration.connections.findIndex((connection) => connection.id === connectionId)
      this.currentIntegration.connections.splice(sourceIndex, 1)
    }

    this.isLoading = false
  }

  remove = async (id: string): Promise<void> => {
    this.isLoading = true
    const removedSource = await API.integrations.remove(id)
    const sourceIndex = this.integrations.findIndex((source) => source.id === id)
    if (removedSource) {
      this.integrations.splice(sourceIndex, 1)
    }
    this.isLoading = false
  }

  post = async (id: string, integration: ConnectionPost): Promise<any> => {
    this.isLoading = true
    const newIntegration = await API.integrations.post(id, integration)
    runInAction(() => {
      this.isLoading = false
    })
    return newIntegration
  }

  saveAuthentication = async (options: TrayAuthData): Promise<any> => {
    this.isLoading = true
    const newConnection = await API.tray.saveAuth(options)
    // TODO: when the endpoint returns the conection data push on the top of list
    runInAction(() => {
      this.isLoading = false
    })
    return newConnection
  }

  update = async (integrationId: string, connectionId: string, integration: ConnectionEdit): Promise<any> => {
    const updatedIntegration = await API.integrations.update(integrationId, connectionId, integration)
    // if the update just changed the name update the connection with the new name
    if (integration.connectionName && !(updatedIntegration instanceof Error)) {
      const isUpdatedConnection = (connection: Connection) => {
        return connection.id === connectionId
      }

      runInAction(() => {
        if (this.currentIntegration) {
          const indexOfupdatedConnection = this.currentIntegration.connections.findIndex(isUpdatedConnection)
          if (this.currentIntegration.connections[indexOfupdatedConnection].name && integration.connectionName) {
            this.currentIntegration.connections[indexOfupdatedConnection].name = integration.connectionName
          }
        }
      })
    }

    return updatedIntegration
  }

  postAction = async (action: ActionPost): Promise<any> => {
    this.isLoading = true
    const newIntegration = await API.integrations.postAction(action)
    runInAction(() => {
      this.isLoading = false
    })
    return newIntegration
  }
}
