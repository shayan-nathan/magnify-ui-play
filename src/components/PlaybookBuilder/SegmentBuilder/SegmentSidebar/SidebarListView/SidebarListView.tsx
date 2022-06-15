import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { DragEvent } from 'react'

import { useStore } from 'store'
import { IconCaretRight, IconGripper } from 'components/common/Icons/Icons'
import { getMenuItemIcon } from 'components/PlaybookBuilder/Utils/serviceUtils'

import { breadcrumbInfo, SourceData } from 'components/PlaybookBuilder/PlaybookBuilderTypes'
import { MetadataDescription } from 'models'

interface SidebarListViewProps {
  breadCrumbItems: breadcrumbInfo[]
  handleSelectOption: (item: MetadataDescription) => void
  handleDragStart: (
    e: DragEvent<HTMLDivElement>,
    item: MetadataDescription,
    breadCrumbItem: any[],
    position: any,
  ) => void
  handleDragEnd: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
}

export const SidebarListView: FC<SidebarListViewProps> = observer((props: SidebarListViewProps) => {
  const { handleSelectOption, breadCrumbItems, handleDragStart, handleDragEnd } = props
  const { metadataStore } = useStore()

  const displayCaret = (item: MetadataDescription): boolean => {
    return item.type === undefined
  }

  const isDraggable = (item: MetadataDescription): boolean => {
    return item.type !== undefined
  }

  return (
    <ul className='menu'>
      {metadataStore.viewListMetadata.map((item: MetadataDescription, index: number) => {
        return (
          <li
            key={item.name}
            onDragStart={(e: any) => handleDragStart(e, item, breadCrumbItems, index)}
            onDragEnd={(e: any) => handleDragEnd(e)}
            draggable={isDraggable(item)}
            onClick={() => {
              if (!isDraggable(item)) {
                handleSelectOption(item)
              }
            }}
            className='menu__item'>
            {getMenuItemIcon(item)}
            <span className='menu__name'>{item.name}</span>
            {displayCaret(item) && <IconCaretRight />}
            {isDraggable(item) && <IconGripper />}
          </li>
        )
      })}
    </ul>
  )
})
