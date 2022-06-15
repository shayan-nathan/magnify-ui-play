import { createContext, FC, useContext } from 'react'
import { UserStore } from './user.store'
import { IntegrationsStore } from './integrations.store'
import { InsightsStore } from './insights.store'
import { PlaybookStore } from './playbook.store'
import { NotificationStore } from './notifications.store'
import { MetadataStore } from './metadata.store'

class RootStore {
  userStore
  integrationsStore
  insightsStore
  playbookStore
  notificationStore
  metadataStore

  constructor() {
    this.userStore = new UserStore()
    this.integrationsStore = new IntegrationsStore()
    this.insightsStore = new InsightsStore()
    this.playbookStore = new PlaybookStore()
    this.notificationStore = new NotificationStore()
    this.metadataStore = new MetadataStore()
  }
}

const StoreContext = createContext<RootStore>(new RootStore())
const StoreProvider: FC<{ store: RootStore }> = ({ store, children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStore = () => useContext(StoreContext)

export { RootStore, StoreProvider, useStore }
