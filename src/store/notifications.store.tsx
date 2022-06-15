import { NOTIFICATIONS_PER_PAGE } from 'configs'
import { makeAutoObservable, runInAction } from 'mobx'
import { getValidTokenInFuture } from 'services/Utils/getAuthToken'

import { API } from '../api/api'
import { NotificationData } from '../models/notification.model'

const wssBaseURL = process.env.REACT_APP_WS_URL || ''

/* eslint-disable no-unused-vars */
export enum Message {
  CONNECTED = 'Connected',
  ERROR = 'Error occurred',
  DISCONNECT = 'Disconnected',
}

export class NotificationStore {
  notifications: NotificationData[] = []
  unSeenNotifications: NotificationData[] = []
  isLoading: boolean = true
  token: string = ''
  selfClosing = false
  websocket: any | null = null
  wssUrl: string = wssBaseURL
  reconnectTimeout: any
  isNotificationPushed: boolean = false
  constructor() {
    makeAutoObservable(this)
  }

  handleWebsocketConnect = async () => {
    if (this.selfClosing) {
      this.selfClosing = false
    }
    const validTokenInFuture = await getValidTokenInFuture()
    this.token = validTokenInFuture || this.token
    if (!this.websocket) {
      this.websocket = new WebSocket(`${this.wssUrl}/?token=${this.token}`)
      // called when the WebSocket connection's readyState changes to CLOSED
      this.websocket.onclose = async () => {
        if (this.selfClosing === false) {
          this.websocket = null
          this.startAttemptingToEstablishConnection()
        } else {
          runInAction(() => {
            this.websocket = null
            this.unSeenNotifications = []
          })
        }
      }
      this.websocket.onopen = async () => {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout)
        }
      }
      this.websocket.onerror = async () => {
        if (this.selfClosing === false) {
          this.startAttemptingToEstablishConnection()
        }
      }
      this.websocket.onmessage = (response: any) => {
        const data = JSON.parse(response.data)
        runInAction(() => {
          if (data?.wsType !== 'delete') {
            this.unSeenNotifications.unshift(data)
            if (this.notifications.length) {
              this.notifications.unshift(data)
              this.isNotificationPushed = true
            }
          }
          if (data?.wsType === 'delete') {
            this.setIsLoading(true)
            const notificationIndex = this.notifications.findIndex((notification) => notification.id === data.id)
            const unSeenNotificationIndex = this.notifications.findIndex((notification) => notification.id === data.id)
            if (unSeenNotificationIndex >= 0) {
              // check if the notification is in the unseen array in order to remove it
              this.unSeenNotifications.splice(unSeenNotificationIndex, 1)
            }

            if (notificationIndex >= 0) {
              // check if the notification is in the notifcation array in order to remove it
              const copyOfNotifications = [...this.notifications]
              copyOfNotifications.splice(notificationIndex, 1)
              this.setNotifications(copyOfNotifications, true)
            }
            this.setIsLoading(false)
          }
        })
      }
    }
  }

  handleDisconnect = async () => {
    if (this.websocket) {
      this.selfClosing = true
      await this.websocket.close()
      this.websocket = null
    }
  }
  private startAttemptingToEstablishConnection() {
    this.reconnectTimeout = setTimeout(() => this.handleWebsocketConnect(), 5000)
  }

  setNotifications = (notifications: NotificationData[], afterDelete?: boolean) => {
    if (!afterDelete) {
      // store the notification ids in order to eliminate the duplicates of notifications
      // there is a case when

      const ids = new Set(this.notifications.map((notification) => notification.id))
      this.notifications.push(...notifications.filter((d: any) => !ids.has(d.id)))
    } else {
      this.notifications = notifications
    }
  }

  getUnseenNotifications = async (): Promise<void> => {
    const { notifications } = await API.notifications.getAll({ unseen: true, limit: NOTIFICATIONS_PER_PAGE })
    runInAction(() => {
      this.unSeenNotifications.push(...notifications)
    })
  }

  markSeenNotifications = async (): Promise<void> => {
    const response = await API.notifications.update()
    runInAction(() => {
      if (!(response instanceof Error)) {
        this.unSeenNotifications = []
      }
    })
  }

  removeNotification = async (notificationId: string): Promise<void> => {
    this.setIsLoading(true)
    const removedNotification = await API.notifications.remove(notificationId)
    const notificationIndex = this.notifications.findIndex((notification) => notification.id === notificationId)

    runInAction(() => {
      if (!(removedNotification instanceof Error)) {
        if (removedNotification) {
          this.notifications.splice(notificationIndex, 1)
          this.setIsLoading(false)
          return removedNotification
        }
      } else {
        return removedNotification
      }
    })
  }

  setIsLoading = (value: boolean) => {
    this.isLoading = value
  }
}
