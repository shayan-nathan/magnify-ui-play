import { FC, useState } from 'react'
import { Badge, Button, Popover, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

import { Heading } from 'components/common'
import { useStore } from 'store'
import { NOTIFICATIONS_PER_PAGE } from 'configs'

import { ReactComponent as NotificationBell } from '../../assets/icons/sideMenu/notification-bell.svg'

interface NotificationsPopUpProps {}

export const NotificationsPopUp: FC<NotificationsPopUpProps> = observer(() => {
  const { notificationStore } = useStore()
  const { unSeenNotifications, markSeenNotifications } = notificationStore

  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false)

  const content = (
    <div className='popup-content'>
      <Row>
        <Heading level='3' variant='2'>
          Notifications
        </Heading>
        <Link to={'/account-settings/notifications'}>
          <Button
            className='ant-btn-link btn-view-all'
            onClick={() => {
              changeVisibilityHandler(false)
            }}>
            View all
          </Button>
        </Link>
      </Row>

      {unSeenNotifications.length ? (
        unSeenNotifications.map((notification) => (
          <div key={notification.id} className={`notification-card notification-card--${notification.priority}`}>
            <div className='notification-text'>
              <span>{notification.message}</span>
              {notification?.info?.app && (
                <Link to={`/integrations/${notification.info.app}/edit/${notification.info.connectionId}`}>
                  <Button className='ant-btn-link notification-btn'>Adress the issue</Button>
                </Link>
              )}
            </div>

            <p className='notification-time'>
              {dayjs(notification.createdAt).format('MMM DD, YYYY')} at {dayjs(notification.createdAt).format('h:mm A')}
            </p>
          </div>
        ))
      ) : (
        <span>No new notifications</span>
      )}
    </div>
  )
  const changeVisibilityHandler = (visible: boolean) => {
    setIsPopupVisible(visible)
    if (!visible && unSeenNotifications.length) {
      markSeenNotifications()
    }
  }

  return (
    <Popover
      content={content}
      trigger='click'
      overlayClassName='notifications-popup'
      visible={isPopupVisible}
      onVisibleChange={changeVisibilityHandler}>
      <Badge
        count={
          unSeenNotifications.length > NOTIFICATIONS_PER_PAGE - 1
            ? `${NOTIFICATIONS_PER_PAGE - 1}+`
            : unSeenNotifications.length
        }
        offset={[-5, 0]}>
        <NotificationBell />
      </Badge>
    </Popover>
  )
})
