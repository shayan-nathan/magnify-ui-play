import { EllipsisOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { FC } from 'react'

import { Integration } from 'models/Integration.model'
import { LogoService } from 'services/Utils/logo'

interface ConnectedAppItemProps {
  source: Integration
  clickHandler(): void
}

export const ConnectedAppItem: FC<ConnectedAppItemProps> = (props: ConnectedAppItemProps) => {
  const { source, clickHandler } = props

  return (
    <Button className='c-app__item' onClick={clickHandler}>
      <img src={LogoService.getIcon(source.id)} alt={source.id} />
      <span className='c-app__name'>{source.name}</span>
      <EllipsisOutlined className='c-builider-icon__right' />
    </Button>
  )
}
