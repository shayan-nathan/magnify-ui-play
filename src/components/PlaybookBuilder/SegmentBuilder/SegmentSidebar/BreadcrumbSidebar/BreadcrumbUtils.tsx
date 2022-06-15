import { Breadcrumb } from 'antd'

import { breadcrumbInfo } from 'components/PlaybookBuilder/PlaybookBuilderTypes'

interface GetBreadcrumbType {
  breadcrumb: breadcrumbInfo
  index: number
  handleSelectBreadcrumb: (index: number) => void
  getMenuItemIcon: (breadcrumb: breadcrumbInfo, show: boolean) => JSX.Element | null
}

export function getBreadcrumb(props: GetBreadcrumbType): JSX.Element {
  const { breadcrumb, index, handleSelectBreadcrumb, getMenuItemIcon } = props
  return (
    <Breadcrumb.Item
      key={breadcrumb.name}
      className='breadcrumb__item'
      onClick={() => {
        handleSelectBreadcrumb(index)
      }}>
      <span className='breadcrumb__image'>{getMenuItemIcon(breadcrumb, true)}</span>
      <div className='breadcrumb__name'>
        <span>{breadcrumb.name}</span>
      </div>
    </Breadcrumb.Item>
  )
}
