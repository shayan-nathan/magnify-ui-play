import { FC } from 'react'

import { LogoService } from 'services/Utils/logo'
import { Heading } from '..'
import { Row } from 'antd'

interface IntegrationHeaderProps {
  integrationId: string
  children?: JSX.Element | JSX.Element[] | string
}

export const IntegrationHeader: FC<IntegrationHeaderProps> = (props: IntegrationHeaderProps) => {
  const { integrationId, children } = props

  return (
    <Row align='middle' className='m-b-20'>
      <img src={LogoService.getIcon(integrationId)} alt={integrationId} />
      <Heading level='1' variant='2' className='c-source--name'>
        {integrationId}
      </Heading>
      {children}
    </Row>
  )
}
