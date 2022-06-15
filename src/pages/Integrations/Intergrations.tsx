import { FC, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Col, Row, Skeleton } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { useStore } from 'store'
import { Card, Heading, ConnectedStatus } from 'components/common'
import { LogoService } from 'services/Utils/logo'
import { Integration } from 'models/Integration.model'
import { OAuth } from 'components/OAuth/OAuth'
import integrationSettings from 'services/Utils/integrationSettings'

export const Intergrations: FC = observer(() => {
  const { integrationsStore } = useStore()
  const { getAll, isLoading } = integrationsStore
  const navigate = useNavigate()

  useEffect(() => {
    getAll()
  }, [])
  const redirectToAddIntegration = useCallback((id) => navigate(`/integrations/${id}/add`), [navigate])

  const integrations = integrationsStore.integrations
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
          title='Add connection'></OAuth>
      )
    }
    return (
      <Button
        className='c-button--1'
        onClick={() => {
          redirectToAddIntegration(integration.id)
        }}>
        Add connection
      </Button>
    )
  }
  return (
    <main className='integrations-main'>
      <Heading level='1' variant='1'>
        Integrations
      </Heading>

      {isLoading ? (
        <Skeleton />
      ) : (
        integrations.map((integration) => (
          <Card variant='1' key={integration.id}>
            <Row className='c-flex--center'>
              <Col xs={2} md={1} lg={1}>
                <img src={LogoService.getIcon(integration.id)} alt={integration.id} />
              </Col>
              <Col xs={14} md={8} lg={11} xl={15}>
                <span className='c-source--name'>{integration.name}</span>
              </Col>
              <Col xs={6} md={7} lg={6} xl={4} className='c-flex--start'>
                <ConnectedStatus connections={integration.connections} status={integration.status} />
              </Col>
              <Col xs={22} md={7} lg={6} xl={3}>
                {integration.connections.length ? (
                  <Link to={`/integrations/${integration.id}`}>
                    <Button className='c-button--1'>Edit </Button>
                  </Link>
                ) : (
                  addConnectionButton(integration)
                )}
              </Col>
            </Row>
          </Card>
        ))
      )}
    </main>
  )
})
