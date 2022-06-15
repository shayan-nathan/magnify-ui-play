import { FC } from 'react'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import { Route, Routes } from 'react-router-dom'

import { SideNav } from 'components/SideNav/SideNav'
import { Insights } from 'components/Insights/Insights'
import { PlaybookPage } from './Playbook/Playbook.page'

import { PlaybooksList } from './PlaybooksList/PlaybooksList'

export const Automation: FC = () => {
  return (
    <main className='automation-main'>
      <Routes>
        <Route path='playbook/new' element={<PlaybookPage />} />
        <Route path='playbook/:id/:version' element={<PlaybookPage />} />
        <Route
          path='/*'
          element={
            <Layout className='ant-layout-has-sider playbook-builder'>
              <Sider className='c-sider' width={265}>
                <SideNav />
              </Sider>
              <Layout className='content'>
                <Content
                  className='c-insights'
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}>
                  <Insights />
                  <PlaybooksList />
                </Content>
              </Layout>
            </Layout>
          }
        />
      </Routes>
    </main>
  )
}
