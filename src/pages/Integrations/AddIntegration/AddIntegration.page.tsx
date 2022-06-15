import { FC, useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'hooks'

import { Card, Heading, IntegrationHeader } from 'components/common'
import { useStore } from 'store'
import { ConnectionPost } from 'models/Integration.model'
import { MarketoForm, SalesforceForm } from 'components/IntegrationForms'
import { TrayAuthentication } from '../../../components/TrayAuthentication/TrayAuthentication'

interface AddIntegrationPageProps {}

export const AddIntegrationPage: FC<AddIntegrationPageProps> = observer(() => {
  const { id }: any = useParams()
  const query = useQuery()
  const { integrationsStore } = useStore()
  const { currentIntegration } = integrationsStore
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [apiLogin, setApiLogin] = useState<boolean>(false)
  const code = query.get('code') || ''
  const integration = currentIntegration
  let integrationForm

  const bothWayConnection = integration?.oauth && integration.userLogin ? true : false
  const [loading, setLoading] = useState<boolean>(false)
  const onCancelClick = useCallback(() => navigate(`/integrations/`), [navigate])
  const backToAddIntegration = useCallback(() => navigate(`/integrations/${id}/add`), [navigate])
  const onAddConnectionSuccess = useCallback(() => navigate(`/integrations/${id}`), [navigate])

  useEffect(() => {
    integrationsStore.get(id)
  }, [])

  const onCancelHandler = () => {
    if (apiLogin) {
      setApiLogin(false)
    }
    if (code) {
      // clear the URL params
      backToAddIntegration()
    } else {
      onCancelClick()
    }
  }

  async function onAuthLastStep(values: any) {
    const { connectionName }: ConnectionPost = values
    const clientId = currentIntegration?.clientId || ''
    const data = {
      oauth: true,
      clientId,
      code,
      connectionName,
    }
    setLoading(true)
    setError(null)
    const response = await integrationsStore.post(id, data)
    setLoading(false)
    if (response instanceof Error) {
      setError('Unable to connect. Please try again.')
      return
    }
    onAddConnectionSuccess()
  }

  switch (integration?.id) {
    case 'salesforce':
      integrationForm = (
        <SalesforceForm
          onCancelHandler={onCancelHandler}
          onAddConnectionSuccess={onAddConnectionSuccess}
          integrationId={id}
        />
      )
      break
    case 'intercom':
      integrationForm = null
      break
    case 'marketo':
      integrationForm = (
        <MarketoForm
          onCancelHandler={onCancelHandler}
          onAddConnectionSuccess={onAddConnectionSuccess}
          integrationId={id}
        />
      )
      break
    default:
      integrationForm = null
      break
  }

  return (
    <main className='integrations-main'>
      <Link
        to={apiLogin && bothWayConnection ? `/integrations/${id}/add` : `/integrations/${id}`}
        onClick={() => {
          setApiLogin(false)
        }}>
        {'<'} Back
      </Link>
      {integration && <IntegrationHeader integrationId={integration.id} />}
      {/* the card is displayed when both types of connections are true and it was selected the Api login
      or when is available only the API login */}
      {(!bothWayConnection && apiLogin) || (apiLogin && integrationForm)}
      {/* /* the card is displayed only when API connection is available */}
      {!bothWayConnection && integration?.userLogin && integrationForm}
      {/* the card is displayed only when are both connections true and the user needs to decide which one he choose*/}
      {bothWayConnection && !apiLogin && !code && (
        <Card variant='2'>
          <Col md={24} lg={12}>
            <Heading level='2' variant='2'>
              Add new connection
            </Heading>
          </Col>
          <Col md={24} className='m-t-24'>
            <TrayAuthentication />
          </Col>
        </Card>
      )}

      {/* Final step Oauth */}
      {((bothWayConnection && !apiLogin && code) || (!bothWayConnection && code)) && (
        <>
          {loading ? (
            <Spin />
          ) : (
            <Card variant='2'>
              <Col md={24} lg={12}>
                <Heading level='2' variant='2'>
                  Connect via Oauth Final step
                </Heading>
                <p className='secondary-text'>
                  Now we are authorized but we would like to know the name for this connection
                </p>
              </Col>

              <Form layout='vertical' onFinish={onAuthLastStep}>
                <Col md={24} lg={10}>
                  <Form.Item
                    label='Enter Connection Name'
                    name='connectionName'
                    rules={[{ required: true, message: 'Please input the connection name!' }]}>
                    <Input placeholder='Connection Name' />
                  </Form.Item>
                  {error && <Alert message={error} type='error' />}
                </Col>
                <Col md={24}>
                  <Button htmlType='submit' className='c-button--2'>
                    Connect
                  </Button>
                  <Button className='c-button--1 m-l-24' onClick={onCancelHandler}>
                    Cancel
                  </Button>
                </Col>
              </Form>
            </Card>
          )}
        </>
      )}
    </main>
  )
})
