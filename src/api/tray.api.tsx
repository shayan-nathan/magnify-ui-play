import axios from 'axios'

import { LoggerService } from '../services/LogService/LogService'

import { TrayAuthData, TrayAuthentications } from '../models'

const base_url = process.env.REACT_APP_INTEGRATIONS_API

export const getAuthUrl = async (platform: string): Promise<TrayAuthentications> => {
  try {
    const { data } = await axios.get<TrayAuthentications>(`${base_url}/getAuthOnlyDialogUrl`, {
      params: { platform },
    })
    return data
  } catch (error) {
    LoggerService.error({ message: 'getAuthUrl error', error })
    return { authOnlyDialogUrl: '', userAccessToken: '', error }
  }
}
export const saveAuth = async (options: TrayAuthData): Promise<TrayAuthentications> => {
  try {
    const { data } = await axios.post<any>(`${base_url}/postTrayIoAuthenticate`, options)
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'saveAuth error', error })
    return error
  }
}
