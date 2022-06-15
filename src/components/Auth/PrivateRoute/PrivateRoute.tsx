import { Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Navigate } from 'react-router-dom'

import { useStore } from 'store'

interface Props {
  component: React.ComponentType
  path?: string
  roles?: string[]
}

const PrivateRoute: React.FC<Props> = observer(({ component: RouteComponent, roles }): React.ReactElement => {
  const { userStore } = useStore()
  const { username, isLoading } = userStore

  const isAuthenticated = Boolean(username)
  const userHasAccess = (isAuthenticated && !roles) || (roles?.length && roles.includes(userStore.role))
  // A user has access only if he is authentificated and the component doesn't require specific role or he has the required role

  if (!isLoading) {
    if (isAuthenticated) {
      if (userHasAccess) {
        // authorised so return componen
        return <RouteComponent />
      } else {
        // role not authorised so redirect to home page
        return <Navigate to='/' />
      }
    } else {
      return <Navigate to='/signin' />
    }
  }
  return <Spin size='large' className='centered-spiner'></Spin>
})

export default PrivateRoute
