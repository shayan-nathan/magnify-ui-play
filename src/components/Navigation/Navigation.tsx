import React, { useEffect } from 'react'
import { Dropdown, Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { observer } from 'mobx-react-lite'
import { LogoutOutlined } from '@ant-design/icons'

import { useStore } from 'store'
import { NotificationsPopUp } from 'components/NotificationsPopUp/NotificationsPopUp'
import {
  MainLogo,
  CollapsedLogo,
  FirstMenuItem,
  SecondMenuItem,
  ThirdMenuItem,
  HelpCircle,
  RightArrow,
  DefaultPic,
  NotificationBell,
} from './NavigationIcons'

interface NavigationProps {
  locationPathname: string
}
export const Navigation: React.FunctionComponent<NavigationProps> = observer((props) => {
  const { notificationStore } = useStore()
  const { getUnseenNotifications, unSeenNotifications } = notificationStore

  const { locationPathname } = props
  const { userStore } = useStore()
  const { username } = userStore
  let selectedKey = '1'

  useEffect(() => {
    getUnseenNotifications()
  }, [])

  async function signOut() {
    await Auth.signOut()
    userStore.setUser({ username: null, email: null })
  }

  switch (locationPathname.split('/')[1]) {
    case 'home':
      selectedKey = '1'
      break
    case 'journeys':
      selectedKey = '2'
      break
    case 'integrations':
      selectedKey = '3'
      break
    default:
      selectedKey = '5'
      break
  }

  const isPlaybookRoute = selectedKey === '2'

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/account-settings/'>Account Settings</Link>
      </Menu.Item>
      <Menu.Item key='2'>
        <Link to='/change-password'>Change password</Link>
      </Menu.Item>
      <Menu.Item key='3' onClick={signOut}>
        <LogoutOutlined /> <span> Sign out</span>
      </Menu.Item>
    </Menu>
  )
  return (
    <Sider
      className={`side-main-menu ${isPlaybookRoute ? 'collapsed-menu' : 'extended-menu'}`}
      trigger={null}
      width={`${isPlaybookRoute ? '60px' : '260px'}`}
      collapsible>
      <div className='logo'>
        <Link to='/home'>{isPlaybookRoute ? <CollapsedLogo /> : <MainLogo />}</Link>
      </div>
      <Menu mode='inline' defaultSelectedKeys={[selectedKey]} selectedKeys={[selectedKey]}>
        <Menu.Item key='1'>
          <Link className='first-menu-item' to='/home'>
            <FirstMenuItem />
            <span className={`${isPlaybookRoute && 'collapsed-item'}`}>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key='2'>
          <Link className='second-menu-item' to='/journeys/playbook/new'>
            <SecondMenuItem />
            <span className={`${isPlaybookRoute && 'collapsed-item'}`}>Journeys</span>
          </Link>
        </Menu.Item>
        <Menu.Item key='3'>
          <Link className='third-menu-item' to='/integrations'>
            <ThirdMenuItem />
            <span className={`${isPlaybookRoute && 'collapsed-item'}`}>Integrations</span>
          </Link>
        </Menu.Item>
      </Menu>

      <div className='bottom-container'>
        {isPlaybookRoute ? (
          <HelpCircle />
        ) : (
          <div className='bottom__help-center'>
            <HelpCircle />
            <span>Help center</span>
            <RightArrow className='right-arrow' />
          </div>
        )}
        <div className='bottom__profile'>
          <Dropdown className='dropdown-menu' overlay={menu} placement='top'>
            <div className='ant-dropdown-link'>
              <DefaultPic />
              {isPlaybookRoute && unSeenNotifications.length ? (
                <NotificationBell className='notification-bell' />
              ) : (
                <div className='bottom__profile-user-info'>
                  <span>{username}</span>
                  <span>Webflow</span>
                </div>
              )}
            </div>
          </Dropdown>

          {selectedKey !== '2' && <NotificationsPopUp />}
        </div>
      </div>
    </Sider>
  )
})
