import { Auth, Hub } from 'aws-amplify'
import { useEffect } from 'react'

import { useStore } from 'store'

export const AuthListener = (): JSX.Element => {
  const { userStore, notificationStore } = useStore()

  async function setAuthListener() {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          userStore.setUser({
            username: data.payload?.data?.username,
            email: data.payload?.data?.attributes?.email || data.payload?.data?.challengeParam?.userAttributes.email,
            role: data.payload?.data?.attributes
              ? data.payload?.data?.attributes['custom:roleId']
              : data.payload?.data?.challengeParam?.userAttributes['custom:roleId'],
            name: data.payload.data.signInUserSession.idToken.payload.name,
            groupIds:
              data.payload?.data?.attributes && data.payload?.data?.attributes['custom:groupIds']
                ? JSON.parse(data.payload?.data?.attributes['custom:groupIds'])
                : [],
          })
          // connect to the websocket
          notificationStore.handleWebsocketConnect()
          break

        case 'signOut':
          userStore.setUser({ username: null, email: null })
          notificationStore.handleDisconnect()
          break
      }
    })
  }

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const username = user.username
      const email = user.attributes?.email
      const name = user.signInUserSession.idToken.payload.name
      const role = user.attributes['custom:roleId']
      const groupIds = user.attributes['custom:groupIds'] ? JSON.parse(user.attributes['custom:groupIds']) : []
      const tenantId = user.attributes['custom:tenantId']
      userStore.setUser({ username, email, role, name, groupIds, tenantId })
      //connect to the websocket
      notificationStore.handleWebsocketConnect()
    } catch (error) {
      userStore.setUser({ username: null, email: null })
    }
  }
  useEffect(() => {
    setAuthListener()
    checkUser()
  }, [])

  return <span></span>
}
