import { FC, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import Sider from 'antd/lib/layout/Sider'
import { Content } from 'antd/lib/layout/layout'
import { Layout } from 'antd'

import { Heading } from 'components/common'

interface ApiDocsProps {}

export const ApiDocs: FC<ApiDocsProps> = () => {
  const [token, setToken] = useState<string>('')
  const docsUrlPlaybooks = `${process.env.REACT_APP_PLAYBOOKS_API}/api-docs`
  const docsUrlMetadata = `${process.env.REACT_APP_METADATA_API}/api-docs`

  const getToken = async () => {
    const currentSession: CognitoUserSession | null = await Auth.currentSession()
    const token = currentSession.getIdToken().getJwtToken()
    setToken(token)
    return token
  }

  const interceptor = async (req: any) => {
    if (req.loadSpec) {
      req.headers.authorization = await getToken()
    }
    return req
  }

  return (
    <div>
      <Layout className='ant-layout-has-sider api-docs'>
        <Sider className='c-sider' width={265}>
          <div className='sidenav'>
            <Heading level='3' variant='5'>
              Authorization(http, Bearer)
            </Heading>
            <textarea rows={4} defaultValue={token}></textarea>
          </div>
        </Sider>

        <Layout className='content'>
          <Content>
            <SwaggerUI url={docsUrlPlaybooks} requestInterceptor={interceptor} />
            <SwaggerUI url={docsUrlMetadata} requestInterceptor={interceptor} />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
