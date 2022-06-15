import { Layout } from 'antd'
import { FC } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { Navigation } from 'components/Navigation/Navigation'
import { Automation } from './Automation/Automation'
import { Dashboard } from './Dashboard/Dashboard'
import { Intergrations } from './Integrations/Intergrations'
import { IntegrationPage } from './Integrations/Integration/Integration.page'
import { AddIntegrationPage } from './Integrations/AddIntegration/AddIntegration.page'
import { ChangePass } from 'components/Auth/ChangePass/ChangePass'
import { EditIntegrationPage } from './Integrations/EditIntegration/EditIntegration.page'
import { AccountSettingsPage } from './AccountSettings/AccountSettings.page'
import { ApiDocs } from './ApiDocs/ApiDocs'

export const Main: FC = () => {
  const location = useLocation()

  return (
    <Layout>
      <Navigation locationPathname={location.pathname} />
      <Routes>
        <Route path='/journeys/*' element={<Automation />} />
        <Route path='/home/*' element={<Dashboard />} />
        <Route path='/integrations' element={<Intergrations />} />
        <Route path='/change-password' element={<ChangePass />} />
        <Route path='/integrations/:id/add' element={<AddIntegrationPage />}></Route>
        <Route path='/integrations/:id/edit/:connectionId' element={<EditIntegrationPage />}></Route>
        <Route path='/integrations/:id' element={<IntegrationPage />}></Route>
        <Route
          path='/account-settings/*'
          element={<AccountSettingsPage locationPathname={location.pathname} />}></Route>
        <Route path='/api-docs' element={<ApiDocs />} />
        <Route path='/*' element={<Navigate to='/home' />} />
      </Routes>
    </Layout>
  )
}
