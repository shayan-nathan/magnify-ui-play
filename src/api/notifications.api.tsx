import axios from 'axios'
import { Notification, NotificationUpdate } from 'models/notification.model'

import { LoggerService } from '../services/LogService/LogService'

const base_url = process.env.REACT_APP_INTEGRATIONS_API

export const getAll = async (options?: any) => {
  try {
    const { data } = await axios.get<Notification>(`${base_url}/notifications`, {
      params: options,
    })
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'get notification error', error })
    return error
  }
}

export const update = async (notificationId?: string, updateData?: NotificationUpdate) => {
  try {
    const { data } = await axios.put<Notification>(
      `${base_url}/notifications/${notificationId ? notificationId : ''}`,
      updateData,
    )
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'update notification error', error })
    return error
  }
}

export const remove = async (notificationId: string) => {
  try {
    const { data } = await axios.delete(`${base_url}/notifications/${notificationId}`)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'remove notification error', error })
    return error
  }
}
