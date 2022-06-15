import { Menu, SubMenuProps } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import { FC, useEffect, useMemo, useState } from 'react'

import { LogoService } from 'services/Utils/logo'
import { Heading } from 'components/common'
import { IconArrowTop, IconSearch } from 'components/common/Icons/Icons'
import { Integration } from 'models/Integration.model'
import { Action, PlaybookActionsType, Platform } from '../PlaybookBuilderTypes'
import { playbookBuilderOptions } from './Settings/PlaybookBuilder.settings'
import { ActionSource } from './ActionSource/ActionSource'
import { SidebarSearch } from './SidebarSearch/SidebarSearch'
import useWindowSize from 'hooks/useWindowSize'

interface PlaybookSidebarProps {
  platforms: Integration[]
}

export const PlaybookSidebar: FC<PlaybookSidebarProps> = () => {
  const { SubMenu } = Menu
  const [filteredActions, setFilteredActions] = useState<PlaybookActionsType>(playbookBuilderOptions)
  const { height } = useWindowSize()
  const [sidebarHeight, setSidebarHeight] = useState(height)
  // TODO: filter the platform based on the connected apps
  const expandMenuIcon = (props: SubMenuProps | any) => {
    const noOfChildren = (props.children as Array<Element>).length
    let menuIcon = <span className='submenu-icon'>{noOfChildren}</span>
    return menuIcon
  }
  const displayActions = (category: string, categorySources: Action[] | Platform[]): JSX.Element[] | JSX.Element => {
    if (category !== 'actions') {
      return (categorySources as Action[]).map((source) => {
        return (
          <ActionSource
            key={source.name}
            action={{ ...source, iconName: source.type, payload: {}, description: source.name }}></ActionSource>
        )
      })
    }
    const platforms = categorySources as Platform[]
    const platformElements = platforms.map((platform) => {
      const platformActions = platform.actions
      const actions = platformActions.map((platform_source) => {
        return (
          <ActionSource
            key={platform_source.name}
            action={{
              ...platform_source,
              platform: platform.name,
              iconName: platform_source.type,
              payload: {},
              description: platform_source.name,
            }}></ActionSource>
        )
      })
      return (
        <SubMenu
          key={platform.name}
          title={platform.name}
          icon={
            <>
              <img src={`${LogoService.getIcon(platform.name)}`} alt={platform.name} />

              <span className='submenu-icon icon-reverse'>
                <IconArrowTop />
              </span>
            </>
          }
          data-testid='submenu-platform'>
          {actions}
        </SubMenu>
      )
    })

    const platformsName = platforms.map((platform) => platform.name)

    return (
      <Menu
        style={{ width: '100%' }}
        inlineIndent={0}
        expandIcon={expandMenuIcon}
        mode='inline'
        data-testid='action-menu'
        defaultOpenKeys={platformsName}>
        {platformElements}
      </Menu>
    )
  }

  const renderElements = (actions: PlaybookActionsType) => {
    const elements = []
    for (const category in actions) {
      const categorySources = (actions as unknown as { [key: string]: Action[] | Platform[] })[category]
      const categoryElements = (
        <div key={category} className='action-group'>
          <Heading level='5' variant='5'>
            {category.toUpperCase()}
          </Heading>

          {displayActions(category, categorySources)}
        </div>
      )
      elements.push(categoryElements)
    }
    return elements
  }

  const memoizedElements = useMemo(() => {
    return renderElements(filteredActions)
  }, [filteredActions])

  useEffect(() => {
    setSidebarHeight(height)
  }, [height])

  return (
    <div>
      <Sider
        className='c-sider playbook-sidebar'
        width={265}
        data-testid='playbook-sidebar'
        style={{ height: `${sidebarHeight}px` }}>
        {/* <span className='c-sider__header' data-testid='playbook-header'>
        Playbook builder
      </span> */}
        {/* EN-477 */}
        <span className='c-sider__header' data-testid='playbook-header'>
          Journey builder
        </span>
        <SidebarSearch prefix={<IconSearch />} onChangeState={setFilteredActions} />

        {memoizedElements}
      </Sider>
    </div>
  )
}
