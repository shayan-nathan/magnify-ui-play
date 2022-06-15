import { useState, useEffect } from 'react'

import { API } from 'api/api'
import { useStore } from 'store'
import { NOTIFICATIONS_PER_PAGE } from 'configs'

function useNotifications(pageNum: number) {
  const [error, setError] = useState(false)
  const { notificationStore } = useStore()
  const { notifications, setNotifications, isLoading, setIsLoading } = notificationStore
  const [hasMore, setHasMore] = useState(false)
  const [reachedTheLimit, setReachedTheLimit] = useState(false)

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)

      const notifications = await API.notifications.getAll({ page: pageNum, limit: NOTIFICATIONS_PER_PAGE })
      if (notifications?.notifications) {
        setNotifications([...notifications.notifications])
      }
      if (notifications instanceof Error) {
        setError(true)
      }
      setIsLoading(false)
      setHasMore(notifications?.pagesNumber > pageNum)
      setReachedTheLimit(notifications?.pagesNumber <= pageNum)
    }
    fetchNotifications()
  }, [pageNum])

  return {
    isLoading,
    error,
    notifications,
    hasMore,
    reachedTheLimit,
    setNotifications,
    setIsLoading,
  }
}

export default useNotifications
