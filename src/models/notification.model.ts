export interface Info {
  errorMessage: string
  connectionId: string
  app: string
}
export interface NotificationData extends NotificationUpdate {
  info: Info
  tenantId: string
  priority: string
  createdAt: number
  message: string
  isDeleted: boolean
  id: string
  personsViewed: string[]
  type: string
}
export interface Notification {
  pagesNumber: number
  totalNotifications: number
  notifications: NotificationData[]
}

export interface NotificationUpdate {
  isSolved?: boolean
}
