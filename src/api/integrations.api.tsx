import axios from 'axios'
import { ActionPost, Integration, ConnectionEdit, ConnectionPost } from 'models/Integration.model'

import { LoggerService } from '../services/LogService/LogService'

const base_url = process.env.REACT_APP_INTEGRATIONS_API
const post_action_base_url = process.env.REACT_APP_POST_ACTION_API
export const post = async (id: string, integration: ConnectionPost) => {
  try {
    const { data } = await axios.post<Integration>(`${base_url}/integrations/${id}`, integration)

    return data
  } catch (error: any) {
    LoggerService.error({ message: 'post Integration API error', error })
    return error
  }
}

export const getAll = async () => {
  try {
    const { data } = await axios.get<Integration[]>(`${base_url}/integrations`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return []
  }
}
export const get = async (id: string) => {
  try {
    const { data } = await axios.get<Integration>(`${base_url}/integrations/${id}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return null
  }
}

export const update = async (integrationId: string, connectionId: string, integration: ConnectionEdit) => {
  try {
    const { data } = await axios.put<Integration>(
      `${base_url}/integrations/${integrationId}/${connectionId}`,
      integration,
    )
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return error
  }
}

export const remove = async (connectionId: string) => {
  try {
    const { data } = await axios.delete(`${base_url}/integrations/${connectionId}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return []
  }
}
export const getActionsData = async (app: string, connectionId: string) => {
  try {
    const { data } = await axios.get(`${base_url}/testConnection/${app}/${connectionId}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return []
  }
}
// TODO find out what is with this API https://q3vhkz8yck.execute-api.us-west-2.amazonaws.com/dev
export const postAction = async (values: ActionPost) => {
  try {
    const { data } = await axios.post(`${post_action_base_url}/action`, values)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return error
  }
}
