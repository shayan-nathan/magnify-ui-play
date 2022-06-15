import axios from 'axios'
import { GroupPost, User, UserPost } from 'models/users.model'

import { LoggerService } from '../services/LogService/LogService'

const base_url = process.env.REACT_APP_USERS_API
// Users API
export const post = async (user: UserPost) => {
  try {
    const { data } = await axios.post<User>(`${base_url}/users`, user)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'postUsersAPI error', error })
    return error
  }
}

export const getAll = async () => {
  try {
    const { data } = await axios.get<User[]>(`${base_url}/listUsers`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getUsersAPI error', error })
    return []
  }
}

export const get = async (id: string) => {
  try {
    const { data } = await axios.get<User>(`${base_url}/users/${id}`)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'getUsersAPI error', error })
    return error
  }
}

export const update = async (user: any) => {
  try {
    const { data } = await axios.put<any>(`${base_url}/users/${user.username}`, user)
    return data
  } catch (error) {
    LoggerService.error({ message: 'updateUsersAPI error', error })
    return error
  }
}

export const remove = async (username: string) => {
  try {
    const { data } = await axios.delete(`${base_url}/users/${username}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getUsersAPI error', error })
    return []
  }
}
// Tenant Endpoint
export const getTenant = async (id: string) => {
  try {
    const { data } = await axios.get(`${base_url}/tenants/${id}`)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'getTenant error', error })
    return error
  }
}

// Roles API
export const getRoles = async () => {
  try {
    const { data } = await axios.get(`${base_url}/getAvailableRoles`)
    return data.roles
  } catch (error) {
    LoggerService.error({ message: 'getUsersAPI error', error })
    return []
  }
}

// Groups API
export const getGroups = async () => {
  try {
    const { data } = await axios.get(`${base_url}/listGroups`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getUsersAPI error', error })
    return []
  }
}

export const postGroup = async (group: GroupPost) => {
  try {
    const { data } = await axios.post<GroupPost>(`${base_url}/groups`, group)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'postGroupsAPI error', error })
    return error
  }
}

export const removeGroup = async (id: string) => {
  try {
    const { data } = await axios.delete(`${base_url}/groups/${id}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'removeGroupsAPI error', error })
    return []
  }
}
