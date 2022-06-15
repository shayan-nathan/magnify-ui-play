import { FC } from 'react'

import { LogoService } from 'services/Utils/logo'

interface InsightSourcesProps {
  sources: string[]
}

export const InsightSources: FC<InsightSourcesProps> = (props: InsightSourcesProps) => {
  const { sources } = props
  const sourcesEl = sources.map((source, i) => (
    <li className='c-source__item' key={source}>
      <img src={LogoService.getIcon(source)} alt={source} />
      {sources.length - 1 !== i ? <span className='c-plus--sign'>+</span> : null}
    </li>
  ))
  return <ul className='c-sources--inline'>{sourcesEl}</ul>
}
