import { Alert, Button, Col, Form, Input, message } from 'antd'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Card, Heading } from 'components/common'
import { useStore } from 'store'
import { ConnectionPost } from 'models/Integration.model'
import { integrationForm } from 'settings/IntegrationsForm'
import { isStatusFailure } from 'services/Utils/validator'

interface MarketoFormProps {
  onCancelHandler(): void
  onAddConnectionSuccess(): void
  integrationId: string
  edit?: boolean
}

export const MarketoForm: FC<MarketoFormProps> = (props: MarketoFormProps) => {
  const { onCancelHandler, onAddConnectionSuccess, integrationId, edit } = props
  const { integrationsStore } = useStore()
  const [error, setError] = useState<string | null>(null)
  const { connectionId }: any = useParams()

  async function onBasicLogin(values: any) {
    const { clientId, clientSecret, subDomain, connectionName }: ConnectionPost = values
    // validations in case the client doesn't enter just the subdomain
    const domain = subDomain
      ? subDomain
          .replace(/\b(?:https:\/\/|http:\/\/|.mktorest.com)\b/gi, '')
          .replace(' ', '')
          .split('/')[0]
      : ''
    const data = { clientId, clientSecret, subDomain: `https://${domain}.mktorest.com/`, connectionName, oauth: false }
    if (edit) {
      // edit Marketo connection flow
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
            {integrationForm.connectByApi.description} Enter your Marketo API details. See Marketo's docs on creating a
            <a href='https://developers.marketo.com/rest-api/custom-services/' rel='noreferrer' target='_blank'>
              {' '}
              custom service{' '}
            </a>
            and
            <a href='https://developers.marketo.com/rest-api/base-url/' rel='noreferrer' target='_blank'>
              {' '}
              finding your endpoint URL
            </a>
            .
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
            label={integrationForm.clientId.label}
            name='clientId'
            rules={[
              { required: integrationForm.clientId.required, message: integrationForm.clientId.requiredMessage },
            ]}>
            <Input placeholder={integrationForm.clientId.placeholder} />
          </Form.Item>

          <Form.Item
            label={integrationForm.clientSecret.label}
            name='clientSecret'
            rules={[{ required: true, message: integrationForm.clientSecret.requiredMessage }]}>
            <Input.Password placeholder={integrationForm.clientSecret.placeholder} autoComplete='off' />
          </Form.Item>

          <Form.Item
            label={integrationForm.subDomain.label}
            name='subDomain'
            rules={[{ required: true, message: integrationForm.subDomain.requiredMessage }]}>
            <Input
              addonBefore='https://'
              placeholder={integrationForm.subDomain.placeholder}
              autoComplete='off'
              addonAfter='.mktorest.com/rest'
            />
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
