import { Auth } from 'aws-amplify'
import dayjs from 'dayjs'

import { LoggerService } from 'services/LogService/LogService'

import { CognitoUserSession, CognitoRefreshToken, CognitoUser } from 'amazon-cognito-identity-js'
export async function getAuthTokenId() {
  try {
    const user: any = await Auth.currentSession()
    return user?.idToken?.jwtToken
  } catch (error) {
    LoggerService.error({ message: 'error getAuthToken', error })
    return ''
  }
}
export async function getValidTokenInFuture() {
  /*
  This function checks the validity of the current token and request a new one in case the current token is about to expire in the next 10 minutes
  This function is mainly used to keep the websoket connection with a valid token
  */
  const validationMinutes = 10
  try {
    const currentSession: CognitoUserSession | null = await Auth.currentSession()
    const timeNow = dayjs(new Date().getTime())
    const tokenExpirationTime = dayjs(currentSession.getIdToken().getExpiration() * 1000)
    const difference = tokenExpirationTime.diff(timeNow, 'minutes', true)
    if (difference > validationMinutes) {
      return currentSession?.getIdToken().getJwtToken()
    } else {
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser()
      const refreshToken = currentSession.getRefreshToken()
      const newToken = await getNewToken(cognitoUser, refreshToken)
      return newToken
    }
  } catch (error) {
    LoggerService.error({ message: 'error getAuthToken', error })
  }
}

async function getNewToken(cognitoUser: CognitoUser | any, refreshToken: CognitoRefreshToken): Promise<string> {
  const newSession: CognitoUserSession = await new Promise((resolve, reject) =>
    cognitoUser.refreshSession(refreshToken, (err: Error, session: CognitoUserSession) => {
      if (!err) {
        return resolve(session)
      }
      LoggerService.error({ message: 'error getAuthToken', error: err })
      return reject(null)
    }),
  )
  return newSession.getIdToken().getJwtToken()
}
