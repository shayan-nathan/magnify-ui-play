import { FC, useEffect, useState } from 'react'
import { Breadcrumb, Menu } from 'antd'

import { IconBurgerMenu } from 'components/common/Icons/Icons'
import { getMenuItemIcon } from 'components/PlaybookBuilder/Utils/serviceUtils'
import { getBreadcrumb } from './BreadcrumbUtils'

import { breadcrumbInfo } from 'components/PlaybookBuilder/PlaybookBuilderTypes'

interface BreadcrumbsSidebarProps {
  breadCrumbItems: breadcrumbInfo[]
  handleSelectBreadcrumb: (index: number) => void
  handleResetBreadcrumbs: () => void
}

export const BreadcrumbSidebar: FC<BreadcrumbsSidebarProps> = (props: BreadcrumbsSidebarProps) => {
  const { breadCrumbItems, handleSelectBreadcrumb, handleResetBreadcrumbs } = props
  const [breadcrumbs, setBreadcrumbs] = useState<JSX.Element[]>()
  const [isHomeDisplayed, setIsHomeDisplayed] = useState<boolean>(false)
  const menuItemsList: breadcrumbInfo[] = []

  const menu = (breadcrumbItems: breadcrumbInfo[]) => (
    <Menu triggerSubMenuAction='click'>
      {breadcrumbItems.map((item, index) => (
        <Menu.Item key={item.name} onClick={() => handleSelectBreadcrumb(index + 2)}>
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  )

  useEffect(() => {
    setIsHomeDisplayed(!!breadCrumbItems.length)

    const uiBreadcrumbs: any[] = []
    breadCrumbItems.forEach((breadcrumb, index) => {
      const isDisplayedInDropdown = breadCrumbItems.length > 3 && index >= 2 && index !== breadCrumbItems.length - 1
      const isTheLastBreadcrumbElement =
        breadCrumbItems.length > 3 && index >= 2 && index === breadCrumbItems.length - 1

      if (isDisplayedInDropdown) {
        menuItemsList.push(breadcrumb)
      } else {
        uiBreadcrumbs.push(getBreadcrumb({ breadcrumb, index, handleSelectBreadcrumb, getMenuItemIcon }))
      }
      if (isTheLastBreadcrumbElement) {
        uiBreadcrumbs.push(
          ...[
            <Breadcrumb.Item overlay={menu(menuItemsList)} key='menu-item'>
              ...
            </Breadcrumb.Item>,
            getBreadcrumb({ breadcrumb, index, handleSelectBreadcrumb, getMenuItemIcon }),
          ],
        )
      }
    })

    setBreadcrumbs(uiBreadcrumbs)
  }, [breadCrumbItems])

  return (
    <Breadcrumb className='breadcrumb'>
      {isHomeDisplayed && (
        <Breadcrumb.Item key='home-btn' className='breadcrumb__item'>
          <IconBurgerMenu onClick={handleResetBreadcrumbs}></IconBurgerMenu>
        </Breadcrumb.Item>
      )}

      {breadcrumbs}
    </Breadcrumb>
  )
}
