import { API } from 'api/api'
import { makeAutoObservable, runInAction } from 'mobx'
import { Tenant } from 'models/tenant'

import { Group, Role, User, UserPost, GroupPost, GenericGroup } from 'models/users.model'

export class UserStore {
  username: string | null = null
  email: string | null = null
  role: string = ''
  name: string | null = null
  groupIds: string[] = []
  userGroups?: GenericGroup[] | null = []
  isLoading = true
  isLoadingGroups: boolean = false
  users: User[] = []
  roles: Role[] = [
    { id: 'e8d45e33-d959-4e69-a340-e4246d53472d', role: 'USER' },
    { id: 'fd1d894f-87c2-40f4-948d-669873373148', role: 'ADMIN' },
  ]
  groups: Group[] = []
  tenant: Tenant = { id: '1', name: 'mvl' }
  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: User) {
    this.username = user.username
    this.email = user.email
    this.role = user.role || this.role
    this.name = user.name || null
    this.userGroups = user.groups || null
    this.groupIds = user.groupIds || []
    this.tenant.id = user.tenantId || ''
    this.isLoading = false
  }
  get = async (id: string): Promise<void> => {
    this.isLoadingGroups = true
    const user = await API.users.get(id)
    runInAction(() => {
      this.setUser(user)
      this.isLoadingGroups = false
    })
  }

  getAll = async (): Promise<void> => {
    const users = await API.users.getAll()
    runInAction(() => {
      this.users = users
    })
  }
  getTenant = async (id: string): Promise<void> => {
    const tenant = await API.users.getTenant(id)
    if (!(tenant instanceof Error)) {
      runInAction(() => {
        this.tenant = tenant
      })
    }
  }
  getRoles = async (): Promise<void> => {
    const roles = await API.users.getRoles()
    runInAction(() => {
      this.roles = roles
    })
  }
  getGroups = async (): Promise<void> => {
    this.isLoadingGroups = true
    const groups = await API.users.getGroups()
    runInAction(() => {
      this.isLoadingGroups = false
      this.groups = groups
    })
  }

  remove = async (username: string): Promise<void> => {
    const removeduser = await API.users.remove(username)
    const sourceIndex = this.users.findIndex((user) => user.username === username)
    if (removeduser) {
      this.users.splice(sourceIndex, 1)
    }
  }
  removeGroup = async (id: string): Promise<void> => {
    const removedGroup = await API.users.removeGroup(id)
    const sourceIndex = this.groups.findIndex((group) => group.id === id)
    if (removedGroup) {
      this.groups.splice(sourceIndex, 1)
    }
  }

  post = async (user: UserPost): Promise<any> => {
    const newUser = await API.users.post(user)
    runInAction(() => {
      this.users.push(newUser)
    })
    return newUser
  }
  postGroup = async (group: GroupPost): Promise<any> => {
    const newGroup = await API.users.postGroup(group)
    runInAction(() => {
      this.groups.push(newGroup)
    })
    return newGroup
  }

  update = async (user: any): Promise<any> => {
    // TODO return from the backend the new user object
    // this.isLoading = true
    const updatedUser = await API.users.update(user)
    // if (updatedUser) {
    // const indexOfupdate = this.users.indexOf(user)
    // this.users.splice(indexOfupdate, 1, updatedUser)
    // }
    // this.isLoading = !this.isLoading
    return updatedUser
  }
}
