import axios from 'axios'
import { Insight } from 'models/insights'

import { LoggerService } from '../services/LogService/LogService'

export const getAll = async () => {
  try {
    const { data } = await axios.get<Insight[]>('https://613741aceac1410017c18258.mockapi.io/insights')
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return []
  }
}
export const get = async (id: string | number) => {
  try {
    const { data } = await axios.get<any>(`https://613741aceac1410017c18258.mockapi.io/insights/${id}`)
    return data
  } catch (error) {
    LoggerService.error({ message: 'getConnectionAPI error', error })
    return null
  }
}
