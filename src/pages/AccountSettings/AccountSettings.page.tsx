import { FC } from 'react'
import { Layout, Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import { Content } from 'antd/lib/layout/layout'
import { Route } from 'react-router'
import { Link, Navigate, Routes } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Groups, Profile, Users, Notifications } from 'components/AccountSettings'
import { ReactComponent as IconProfile } from 'assets/images/profile.svg'
import { ReactComponent as IconUsers } from 'assets/images/users.svg'
import { ReactComponent as IconGroups } from 'assets/images/groups.svg'
import { useStore } from 'store'
import PrivateRoute from 'components/Auth/PrivateRoute/PrivateRoute'
import { Role } from 'services/Utils/Role'
import { ReactComponent as IconBell } from 'assets/images/settings_bell.svg'
interface AccountSettingsPageProps {
  locationPathname: string
}

export const AccountSettingsPage: FC<AccountSettingsPageProps> = observer((props) => {
  const { locationPathname } = props
  let selectedKey = '1'
  const { userStore } = useStore()
  switch (locationPathname.split('/')[2]) {
    case 'profile':
      selectedKey = '1'
      break
    case 'users':
      selectedKey = '2'
      break
    case 'groups':
      selectedKey = '3'
      break
    case 'notifications':
      selectedKey = '4'
      break
    default:
      selectedKey = '1'
      break
  }

  return (
    <Layout className='ant-layout-has-sider account-settings'>
      <Sider className='c-sider' width={265}>
        <span className='c-sider__header'>Account Settings</span>
        <Menu mode='inline' defaultSelectedKeys={[selectedKey]} selectedKeys={[selectedKey]} inlineIndent={0}>
          <Menu.Item key='1'>
            <IconProfile />
            <Link to='profile'> Profile</Link>
          </Menu.Item>
          {userStore.role !== Role.User && (
            <>
              <Menu.Item key='2'>
                <IconUsers />
                <Link to='users'> Users</Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <IconGroups />
                <Link to='groups'> Groups</Link>
              </Menu.Item>
            </>
          )}
          <Menu.Item key='4'>
            <IconBell />
            <Link to='notifications'> Notifications</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='content'>
        <Content>
          <Routes>
            <Route path=':profile' element={<Profile />} />
            <Route
              path='users'
              element={
                <PrivateRoute path='users' roles={[Role.Admin, Role.SuperAdmin]} component={Users}></PrivateRoute>
              }
            />
            <Route
              path='groups'
              element={<PrivateRoute path='groups' roles={[Role.Admin, Role.SuperAdmin]} component={Groups} />}
            />
            <Route
              path='notifications'
              element={
                <PrivateRoute
                  path='notifications'
                  roles={[Role.Admin, Role.SuperAdmin, Role.User]}
                  component={Notifications}
                />
              }
            />

            <Route path='*' element={<Navigate to='profile' />}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
})
