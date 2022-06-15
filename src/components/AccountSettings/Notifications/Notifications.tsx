import { FC, useCallback, useRef, useState } from 'react'
import { Alert, Button, Col, Modal, Row, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import { Heading } from 'components/common'
import { useStore } from 'store'
import useNotifications from 'hooks/useNotifications'
import { observer } from 'mobx-react-lite'

export const Notifications: FC = observer(() => {
  const { notificationStore } = useStore()
  const { notifications } = notificationStore
  const { removeNotification } = notificationStore
  const [isDeleteNotificationModalVisible, setIsDeleteNotificationModalVisible] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { isLoading, error, hasMore, reachedTheLimit, setIsLoading, setNotifications } = useNotifications(pageNumber)

  const observerRef = useRef<IntersectionObserver>()

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setIsLoading(true)
      await removeNotification(notificationId)
      const notificationIndex = notifications.findIndex((notification) => notification.id === notificationId)
      const copyOfNotifications = [...notifications]
      copyOfNotifications.splice(notificationIndex, 1)
      setNotifications(copyOfNotifications, true)
      setIsLoading(false)
      handleDeleteNotificationCancel()
    } catch (error) {
      console.log(error)
    }
  }
  const handleDeleteNotificationCancel = () => {
    setIsDeleteNotificationModalVisible(false)
  }

  const showDeleteModal = () => {
    setIsDeleteNotificationModalVisible(true)
  }

  const lastNotificationElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (node && node.parentElement != null && !node.isEqualNode(node.parentElement.lastElementChild)) {
        return
      }
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1)
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isLoading, hasMore, notifications],
  )

  const notificaationEl = notifications.map((notification) => (
    <div key={notification.id} className='notification-content' ref={lastNotificationElementRef}>
      <Row className={`notification-card notification-card--${notification.priority}`}>
        <Col className='notification-text p-l-20 p-r-20' md={16}>
          <p>{notification.message}</p>
          {notification?.info?.app && (
            <Link to={`/integrations/${notification.info.app}/edit/${notification.info.connectionId}`}>
              <Button className='ant-btn-link notification-btn'>Adress the issue</Button>
            </Link>
          )}
        </Col>

        <Col className='notification-time  p-l-20' md={6}>
          {dayjs(notification.createdAt).format('MMM DD, YYYY')} at {dayjs(notification.createdAt).format('h:mm A')}
        </Col>
        <Col className='notification-action  p-l-20' md={2}>
          <Button
            className='btn-circle'
            onClick={() => {
              showDeleteModal()
              setNotificationToDelete(notification.id)
            }}>
            x
          </Button>
        </Col>
      </Row>
    </div>
  ))

  return (
    <div className='notifications view--all'>
      <Heading level='3' variant='1'>
        Notifications
      </Heading>

      {notificaationEl}
      {isLoading && <Skeleton></Skeleton>}
      {error && <Alert message='Something went wrong!' type='error' />}
      {reachedTheLimit && <Alert message='No more notifications.' type='info' />}

      {/* Start Remove notification modal */}
      <Modal
        title='Delete notification'
        visible={isDeleteNotificationModalVisible}
        onCancel={handleDeleteNotificationCancel}
        width={656}
        wrapClassName='remove-notification--modal'
        footer={[
          <Button
            key='submit'
            htmlType='submit'
            className='c-button--1'
            onClick={() => {
              handleDeleteNotification(notificationToDelete)
            }}>
            Yes, delete notification
          </Button>,
        ]}>
        <Heading level='1' variant='3'>
          Are you sure?
        </Heading>
        <p>This action cannot be undone.</p>
      </Modal>
      {/* End Remove notification modal */}
    </div>
  )
})
