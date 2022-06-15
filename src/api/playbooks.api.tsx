import axios from 'axios'

import { BasePlayboook, Playbook, Playbooks, PlaybookUpdate } from 'models/playbook.model'
import { LoggerService } from '../services/LogService/LogService'

const base_url = process.env.REACT_APP_PLAYBOOKS_API
interface GetPlaybook {
  data: Playbook
}

export const getAll = async () => {
  try {
    const { data } = await axios.get<Playbooks>(`${base_url}/playbooks`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getAll error', error })
    return { data: [] }
  }
}
export const get = async (options: PlaybookUpdate) => {
  console.log('options', options)
  const { playbookId, version } = options
  try {
    const { data } = await axios.get<GetPlaybook>(`${base_url}/playbooks/${playbookId}/${version}`)
    return data.data
  } catch (error) {
    LoggerService.error({ message: 'get error', error })
    return error as any
  }
}

export const update = async (playbook: PlaybookUpdate, action?: string) => {
  try {
    const { data } = await axios.put<any>(`${base_url}/playbooks/${action || ''}`, playbook)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'update error', error })
    return error
  }
}

export const clone = async (playbook: PlaybookUpdate) => {
  try {
    const { data } = await axios.post<any>(`${base_url}/playbooks/clone`, playbook)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'update error', error })
    return error
  }
}

export const post = async (playbook: BasePlayboook) => {
  return await axios.post<any>(`${base_url}/playbooks`, playbook)
}

export const execute = async (playbook: PlaybookUpdate) => {
  return await axios.post<any>(`${base_url}/playbooks/execute`, playbook)
}
