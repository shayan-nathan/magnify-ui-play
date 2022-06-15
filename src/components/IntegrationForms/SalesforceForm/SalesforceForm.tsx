import { Alert, Button, Col, Form, Input, message } from 'antd'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Card, Heading } from 'components/common'
import { useStore } from 'store'
import { ConnectionPost } from 'models/Integration.model'
import { integrationForm } from 'settings/IntegrationsForm'
import { isStatusFailure } from 'services/Utils/validator'

interface SalesforceFormProps {
  onCancelHandler(): void
  onAddConnectionSuccess(): void
  integrationId: string
  edit?: boolean
}

export const SalesforceForm: FC<SalesforceFormProps> = (props) => {
  const { onCancelHandler, onAddConnectionSuccess, integrationId, edit } = props
  const { integrationsStore } = useStore()
  const [error, setError] = useState<string | null>(null)
  const { connectionId }: any = useParams()

  async function onBasicLogin(values: any) {
    const { userName, password, securityToken, connectionName }: ConnectionPost = values
    const data = { userName, password, securityToken, connectionName, oauth: false }
    if (edit) {
      // edit Salesforce connection flow
      const responseData = await integrationsStore.update(integrationId, connectionId, data)

      if (isStatusFailure(responseData)) {
        setError('Unable to edit. Please try again.')
        message.error(responseData?.response?.data?.message, 4)
        return
      }
      onAddConnectionSuccess()
      return
    }

    const response = await integrationsStore.post(integrationId, data)
    if (response instanceof Error) {
      setError('Unable to connect. Please try again.')
      message.error(response.message, 4)
      return
    }
    onAddConnectionSuccess()
  }
  return (
    <Card variant='2'>
      <Col md={24} lg={12}>
        <Heading level='2' variant='2'>
          {edit ? integrationForm.editConnection.title : integrationForm.connectByApi.title}
        </Heading>
        {!edit && (
          <p className='secondary-text'>
            {integrationsStore.currentIntegration?.name}
            {integrationForm.connectByApi.description} You can use the username-password flow to authorize a client via
            a connected app that already has the user’s credentials. See Salesforce's docs
            <a
              href='https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_username_password_flow.htm&type=5'
              rel='noreferrer'
              target='_blank'>
              {' '}
              OAuth 2.0 Username-Password Flow for Special Scenarios
            </a>
          </p>
        )}
      </Col>
      <Form layout='vertical' onFinish={onBasicLogin}>
        <Col md={24} lg={10}>
          {!edit && (
            <Form.Item
              label={integrationForm.connectionName.label}
              name='connectionName'
              rules={[
                {
                  required: integrationForm.connectionName.required,
                  message: integrationForm.connectionName.requiredMessage,
                },
              ]}>
              <Input placeholder={integrationForm.connectionName.placeholder} />
            </Form.Item>
          )}
          <Form.Item
            label={integrationForm.username.label}
            name='userName'
            rules={[
              { required: integrationForm.username.required, message: integrationForm.username.requiredMessage },
            ]}>
            <Input placeholder={integrationForm.username.placeholder} />
          </Form.Item>

          <Form.Item
            label={integrationForm.password.label}
            name='password'
            rules={[
              { required: integrationForm.password.required, message: integrationForm.password.requiredMessage },
            ]}>
            <Input.Password placeholder={integrationForm.password.placeholder} autoComplete='off' />
          </Form.Item>

          <Form.Item
            label={integrationForm.securityToken.label}
            name='securityToken'
            rules={[
              {
                required: integrationForm.securityToken.required,
                message: integrationForm.securityToken.requiredMessage,
              },
            ]}>
            <Input.Password placeholder={integrationForm.securityToken.placeholder} autoComplete='off' />
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
  )
}
