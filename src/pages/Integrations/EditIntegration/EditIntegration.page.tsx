import { FC, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Spin } from 'antd'

import { IntegrationHeader } from 'components/common'
import { useStore } from 'store'
import { MarketoForm, SalesforceForm } from 'components/IntegrationForms'

interface EditIntegrationPageProps {}

export const EditIntegrationPage: FC<EditIntegrationPageProps> = observer(() => {
  const { id }: any = useParams()
  const navigate = useNavigate()
  const { integrationsStore } = useStore()
  const { currentIntegration } = integrationsStore

  let integrationForm = null
  const integration = currentIntegration
  const handleOnBackClick = useCallback(() => navigate(`/integrations/${id}`), [navigate])

  useEffect(() => {
    if (integration?.id !== id) {
      integrationsStore.get(id)
    }
  })

  switch (id) {
    case 'salesforce':
      integrationForm = (
        <SalesforceForm
          onCancelHandler={handleOnBackClick}
          onAddConnectionSuccess={handleOnBackClick}
          integrationId={id}
          edit={true}
        />
      )
      break
    case 'intercom':
      integrationForm = null
      break
    case 'marketo':
      integrationForm = (
        <MarketoForm
          onCancelHandler={handleOnBackClick}
          onAddConnectionSuccess={handleOnBackClick}
          integrationId={id}
          edit={true}
        />
      )
      break
    default:
      integrationForm = null
      break
  }

  return (
    <main className='integrations-main'>
      <Link to={`/integrations/${id}`}> {'<'} Back </Link>
      <Spin spinning={!integration}>
        {integration && <IntegrationHeader integrationId={id} />}
        {integrationForm}
      </Spin>
    </main>
  )
})
