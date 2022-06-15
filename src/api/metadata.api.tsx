import axios from 'axios'
import { MetadataTypes } from 'models'

import { LoggerService } from '../services/LogService/LogService'

const base_url = process.env.REACT_APP_METADATA_API

export const get = async (options?: MetadataTypes) => {
  try {
    const { data } = await axios.get(`${base_url}/metadataObject`, {
      params: options,
    })
    return data
  } catch (error: any) {
    LoggerService.error({ message: 'get metadata error', error })
    return error
  }
}
