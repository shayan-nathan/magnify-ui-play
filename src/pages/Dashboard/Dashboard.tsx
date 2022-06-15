// import { Layout } from 'antd'
// import { Content } from 'antd/lib/layout/layout'
// import { observer } from 'mobx-react-lite'
// import { FC } from 'react'

// export const Dashboard: FC = observer(() => {
//   return (
//     <Layout className='content'>
//       <Content
//         style={{
//           padding: 24,
//           margin: 0,
//           minHeight: 280,
//         }}>
//         No conent yet
//       </Content>
//     </Layout>
//   )
// })
/* EN-477 */
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import { Heading } from 'components/common'
import { Insights } from 'components/Insights/Insights'
import { SideNav } from 'components/SideNav/SideNav'
import { observer } from 'mobx-react-lite'
import { PlaybookPage } from 'pages/Automation/Playbook/Playbook.page'
import { PlaybooksList } from 'pages/Automation/PlaybooksList/PlaybooksList'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

export const Dashboard: FC = observer(() => {
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
                  <Heading level='1' variant='1'>
                    Journeys
                  </Heading>
                  <PlaybooksList />
                </Content>
              </Layout>
            </Layout>
          }
        />
      </Routes>
    </main>
  )
})
