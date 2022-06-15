import { FC } from 'react'

import { DateService } from 'services/Utils/date'
import { LogoService } from 'services/Utils/logo'
import { Integration } from 'models/Integration.model'

interface SourceItemProps {
  source: Integration
}

export const SourceItem: FC<SourceItemProps> = (props: SourceItemProps) => {
  const { source } = props
  return (
    <li className='c-source__item'>
      <img src={LogoService.getIcon(source.id)} alt={source.id} />
      <span className='c-source__name'>{source.name}</span>
      <span className='c-source__time'> {DateService.timeSince(source.connectionDate)}</span>
    </li>
  )
}
