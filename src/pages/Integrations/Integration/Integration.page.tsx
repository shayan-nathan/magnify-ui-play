import { FC, useCallback, useState } from 'react'
import { Col, Menu, Row, Dropdown, Button, Spin, Modal, Form, Select, message, Alert, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { Card, ConnectedStatus, Heading, IntegrationHeader } from 'components/common'
import { useStore } from 'store'
import { OAuth } from 'components/OAuth/OAuth'
import { ActionPost, Connection, Integration } from 'models/Integration.model'
import integrationSettings from 'services/Utils/integrationSettings'
import { ErrorMesage } from 'models'
import { integrationForm } from 'settings/IntegrationsForm'
import { isStatusFailure } from 'services/Utils/validator'

interface IntegrationPageProps {}

export const IntegrationPage: FC<IntegrationPageProps> = observer(() => {
  const { id }: any = useParams()
  const { integrationsStore, userStore } = useStore()
  const navigate = useNavigate()
  const { Option } = Select
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const { get, currentIntegration, isLoading, isLoadingActions } = integrationsStore
  const connections = currentIntegration?.connections
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [connectionId, setConnectionId] = useState<string>('')
  const [error, setError] = useState<ErrorMesage | null>(null)
  const [actionModalTitle, setActionModalTitle] = useState<string>('Opportunities')
  const [actionOperation, setActionOperation] = useState<string>('Opportunities')

  useEffectOnce(() => {
    get(id)

    // reset auth url
    integrationsStore.setTrayAuthUrl('')
    // get the auth url
    integrationsStore.getTrayAuthUrl(id)
  })

  const redirectToAddIntegration = useCallback((id) => navigate(`/integrations/${id}/add`), [navigate])

  const onDeleteConnectionHandler = async (connectionId: string) => {
    try {
      await integrationsStore.removeConnection(connectionId)
    } catch (error: any) {
      message.error(error.message, 4)
    }
  }

  const showActionsModal = async (id: string, connectionId: string) => {
    setIsActionsModalVisible(true)
    setConnectionId(connectionId)
    try {
      switch (id) {
        case 'salesforce':
          await Promise.all([integrationsStore.getActions(id, connectionId), userStore.getTenant(userStore.tenant.id)])
          setActionOperation('UpdateOpportunity')
          break

        default:
          setActionModalTitle('Marketo Action')
          await Promise.all([integrationsStore.getActions(id, connectionId), userStore.getTenant(userStore.tenant.id)])
          setActionOperation('SendEmail')
          break
      }
    } catch (error: any) {
      message.error(error.message, 4)
      setError(error)
    }
  }
  const rename = async () => {
    try {
      const values = await editForm.validateFields()
      const { connectionName }: { connectionName: string } = values
      const data = {
        connectionName,
      }

      const responseData = await integrationsStore.update(id, connectionId, data)

      if (isStatusFailure(responseData)) {
        message.error(responseData.response.data.errorMessage, 4)
        setError(responseData)
      } else {
        handleRenameModalCancel()
        message.success('Rename successfully', 4)
      }
    } catch (error: any) {
      if (error.errorFields) {
        setError({ message: 'The form is invalid!', name: 'error', code: 'error' })
      } else {
        message.error(error.message, 4)
        setError(error)
      }
    }
  }

  const showRenameModal = async (connectionId: string) => {
    setIsEditModalVisible(true)
    setConnectionId(connectionId)
  }

  const handleActionModalCancel = () => {
    setIsActionsModalVisible(false)
  }
  const handleRenameModalCancel = () => {
    setIsEditModalVisible(false)
    editForm.resetFields()
    setError(null)
  }
  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }
  // TODO: make the test action more generic
  const sendAction = async () => {
    try {
      const values = await form.validateFields()
      const { opportunityId, MarketoCampaignId, MarketoLeadId }: ActionPost = values
      const data = {
        type: integrationsStore.currentIntegration?.name,
        customer: `${userStore.tenant.name}_${userStore.tenant.id}`,
        operation: actionOperation,
        churn_probability: getRandomArbitrary(0.81, 1).toFixed(4).toString(),
        connectionId: connectionId,
        ...(opportunityId && { opportunityId }),
        ...(MarketoCampaignId && { MarketoCampaignId }),
        ...(MarketoLeadId && { MarketoLeadId }),
      }
      const response = await integrationsStore.postAction(data)

      if (response instanceof Error) {
        message.error(response.message, 4)
        setError({ message: response.message, name: 'error', code: 'error' })
        return
      }
      message.success('opportunity saved', 4)
      setIsActionsModalVisible(false)
    } catch (error: any) {
      if (error.errorFields) {
        setError({ message: 'The form is invalid!', name: 'error', code: 'error' })
      } else {
        message.error(error.message, 4)
        setError(error)
      }
    }
  }

  const menu = (connection: Connection) => (
    <Menu>
      <Menu.Item
        key='1'
        onClick={() => {
          alert('comming soon')
        }}>
        Test connection
      </Menu.Item>
      <Menu.Item
        key='5'
        onClick={() => {
          showActionsModal(id, connection.id)
        }}>
        Test action
      </Menu.Item>
      {!connection.oauth && (
        <Menu.Item key='2'>
          <Link to={`/integrations/${id}/edit/${connection.id}`}>Edit</Link>
        </Menu.Item>
      )}
      <Menu.Item
        key='3'
        onClick={() => {
          showRenameModal(connection.id)
        }}>
        Rename
      </Menu.Item>
      <Menu.Item
        key='4'
        onClick={() => {
          onDeleteConnectionHandler(connection.id)
        }}>
        Delete
      </Menu.Item>
    </Menu>
  )
  // TODO: Create a separate component for this
  const addConnectionButton = (integration: Integration) => {
    if (integration.oauth && !integration.userLogin) {
      return (
        <OAuth
          redirectUri={integration?.redirectUri}
          authorizeLink={integrationSettings(integration).getAuthorizeLink()}
          clientId={integration?.clientId}
          method={integrationSettings(integration).getMethod()}
          responseType={integrationSettings(integration).getResponseType()}
          variant='1'
          title='Add new connection'></OAuth>
      )
    }
    return (
      <Button
        className='c-button--1'
        onClick={() => {
          redirectToAddIntegration(integration.id)
        }}>
        Add new connection
      </Button>
    )
  }
  // TODO: Refactor this in multiple components
  const actionsOptions = integrationsStore.actions.length
    ? integrationsStore.actions.map((action) => (
        <Option key={action.Id} value={action.Id}>
          {action.Name}
        </Option>
      ))
    : []
  const leadsOptions = integrationsStore.marketoData.leads.length
    ? integrationsStore.marketoData.leads.map((lead) => (
        <Option key={lead.id} value={lead.id}>
          {lead.name}
        </Option>
      ))
    : []
  const campaignsOptions = integrationsStore.marketoData.campaigns.length
    ? integrationsStore.marketoData.campaigns.map((campaig) => (
        <Option key={campaig.id} value={campaig.id}>
          {campaig.name}
        </Option>
      ))
    : []

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <main className='integrations-main'>
          <Link to='/integrations'> {'<'} Back </Link>
          {currentIntegration && (
            <IntegrationHeader integrationId={currentIntegration.id}>
              <div className='c-button--right'>{addConnectionButton(currentIntegration)}</div>
            </IntegrationHeader>
          )}
          {connections?.map((connection) => (
            <Card variant='1' key={connection.id}>
              <Row align='middle'>
                <Col sm={12} md={14} lg={16} xl={17}>
                  <Heading level='3' variant='4'>
                    {connection.name}
                  </Heading>
                </Col>
                <Col sm={10} md={8} lg={7} xl={5}>
                  <ConnectedStatus status='connected' date={connection.connectionDate} />
                </Col>
                <Col sm={2} lg={1} xl={2}>
                  <Dropdown.Button overlay={menu(connection)} className='c-drop-down'></Dropdown.Button>
                </Col>
              </Row>
            </Card>
          ))}
          {/* START test actions modal */}
          <Modal
            title={actionModalTitle}
            visible={isActionsModalVisible}
            onCancel={handleActionModalCancel}
            width={656}
            footer={[
              <Button key='submit' htmlType='submit' className='c-button--1' onClick={sendAction}>
                Select
              </Button>,
            ]}>
            <Form
              name='actions'
              form={form}
              labelCol={{
                span: 10,
              }}
              autoComplete='off'>
              {id === 'salesforce' && (
                <Form.Item
                  label='Select an opportunity'
                  name='opportunityId'
                  colon={false}
                  labelCol={{ xs: { span: 8 }, md: { offset: 2 } }}
                  wrapperCol={{ md: 12 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please select an opportunity',
                    },
                  ]}>
                  {isLoadingActions ? (
                    <Spin />
                  ) : (
                    <Select style={{ width: '100%' }} placeholder='Please select an opportunity'>
                      {actionsOptions}
                    </Select>
                  )}
                </Form.Item>
              )}
              {id === 'marketo' && (
                <>
                  <Form.Item
                    label='Select a lead'
                    name='MarketoLeadId'
                    colon={false}
                    labelCol={{ xs: { span: 8 }, md: { offset: 2 } }}
                    wrapperCol={{ md: 12 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select a lead',
                      },
                    ]}>
                    {isLoadingActions ? (
                      <Spin />
                    ) : (
                      <Select style={{ width: '100%' }} placeholder='Please select a lead'>
                        {leadsOptions}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    label='Select a campaign'
                    name='MarketoCampaignId'
                    colon={false}
                    labelCol={{ xs: { span: 8 }, md: { offset: 2 } }}
                    wrapperCol={{ md: 12 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select a campaign',
                      },
                    ]}>
                    {isLoadingActions ? (
                      <Spin />
                    ) : (
                      <Select style={{ width: '100%' }} placeholder='Please select a campaign'>
                        {campaignsOptions}
                      </Select>
                    )}
                  </Form.Item>
                </>
              )}
              {error && <Alert message={error.message} type='error' />}
            </Form>
          </Modal>
          {/* END test actions modal */}

          {/* START rename modal */}
          <Modal
            title='Rename'
            visible={isEditModalVisible}
            onCancel={handleRenameModalCancel}
            width={656}
            footer={[
              <Button key='submit' htmlType='submit' className='c-button--1' onClick={rename}>
                Rename
              </Button>,
            ]}>
            <Form
              name='rename'
              form={editForm}
              labelCol={{
                span: 10,
              }}
              autoComplete='off'>
              <Form.Item
                label={integrationForm.connectionName.label}
                colon={false}
                name='connectionName'
                rules={[
                  {
                    required: integrationForm.connectionName.required,
                    message: integrationForm.connectionName.requiredMessage,
                  },
                ]}>
                <Input placeholder={integrationForm.connectionName.placeholder} />
              </Form.Item>
              {error && <Alert message={error.message} type='error' />}
            </Form>
          </Modal>
          {/* END rename modal */}
        </main>
      )}
    </>
  )
})
