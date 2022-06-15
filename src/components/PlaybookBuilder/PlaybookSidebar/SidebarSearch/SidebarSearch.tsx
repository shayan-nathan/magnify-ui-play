import { FC } from 'react'
import { Input } from 'antd'

import { PlaybookActionsType } from 'components/PlaybookBuilder/PlaybookBuilderTypes'
import { filterActions } from 'components/PlaybookBuilder/Utils/filterUtils'
import { playbookBuilderOptions } from '../Settings/PlaybookBuilder.settings'
import { IconSearch } from 'components/common/Icons/Icons'

interface SidebarSearchProps {
  onChangeState: (filterOptions: PlaybookActionsType) => void
  prefix?: JSX.Element
  placeholder?: string
}

export const SidebarSearch: FC<SidebarSearchProps> = (props: SidebarSearchProps) => {
  const { onChangeState, prefix, placeholder } = props
  const icon = prefix || <IconSearch />
  const searchFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeState(filterActions(playbookBuilderOptions, event.target.value))
  }

  return (
    <Input placeholder={placeholder || 'search'} prefix={icon} onChange={searchFilterHandler} data-testid='search' />
  )
}
