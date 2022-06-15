import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Skeleton } from 'antd'

import { SidebarSearch } from 'components/PlaybookBuilder/PlaybookSidebar/SidebarSearch/SidebarSearch'
import { BreadcrumbSidebar } from './BreadcrumbSidebar/BreadcrumbSidebar'
import { getMenuListFromPath } from './SegmentSidebarUtils'
import { useStore } from 'store'
import { SidebarListView } from './SidebarListView/SidebarListView'

import { MetadataDescription, MetadataRoot } from 'models'
import { SegmentSidebarProps, breadcrumbInfo } from '../../PlaybookBuilderTypes'

export const SegmentSidebar: FC<SegmentSidebarProps> = observer((props: SegmentSidebarProps) => {
  const { handleDragStart, handleDragEnd } = props

  const { metadataStore } = useStore()
  const { metadata, setCurrentItem, addObjectsEntityType, setViewListMetadata } = metadataStore
  const [breadCrumbItems, setBreadCrumbItems] = useState<breadcrumbInfo[]>([])

  const handleResetBreadcrumbs = () => {
    metadataStore.currentItem = {}
    setViewListMetadata(metadata, true)
    setBreadCrumbItems([])
  }

  const handleSelectOption = async (item: MetadataDescription) => {
    setCurrentItem(item)
    const options = metadataStore.currentItem
    const alreadyLoadedMetadata = metadataStore.getLoadedMetadata({
      metadata,
      options,
      iterationNumber: 0,
    })
    if (!alreadyLoadedMetadata?.length) {
      metadataStore.get(options)
    } else {
      metadataStore.setViewListMetadata({ data: alreadyLoadedMetadata })
    }
    addNewBreadcrumb(item)
  }

  const handleSelectBreadcrumb = (index: number) => {
    const path = breadCrumbItems[index].path
    const remainedBreadcrumbs = breadCrumbItems.filter((breadcrumb) => {
      return path.includes(breadcrumb.name)
    })
    setBreadCrumbItems(remainedBreadcrumbs)
    delete metadataStore.currentItem.field
    const currentItem: MetadataDescription = {
      name: remainedBreadcrumbs[remainedBreadcrumbs.length - 1].name,
      entityType: remainedBreadcrumbs[remainedBreadcrumbs.length - 1].entityType,
      data: [],
    }
    setCurrentItem(currentItem)
    const viewItems = getMenuListFromPath(path, metadata.data) as MetadataRoot

    const viewItemsWithTypes = addObjectsEntityType(viewItems)
    setViewListMetadata({ data: viewItemsWithTypes }, true)
  }

  function addNewBreadcrumb(newItem: MetadataDescription) {
    const path: string[] = []
    breadCrumbItems.forEach((element) => {
      path.push(element.name)
    })
    const breadcrumb = {
      name: newItem.name,
      path: [...path, newItem.name],
      entityType: newItem.entityType,
      data: [],
    }
    setBreadCrumbItems([...breadCrumbItems, breadcrumb])
  }

  return (
    <div className='segment-sidebar'>
      <SidebarSearch onChangeState={() => {}} placeholder='Search data' />

      <BreadcrumbSidebar
        breadCrumbItems={breadCrumbItems}
        handleSelectBreadcrumb={handleSelectBreadcrumb}
        handleResetBreadcrumbs={handleResetBreadcrumbs}
      />

      {metadataStore.isLoading ? (
        <Skeleton></Skeleton>
      ) : (
        <SidebarListView
          handleSelectOption={handleSelectOption}
          handleDragStart={handleDragStart}
          handleDragEnd={(e: any) => handleDragEnd(e)}
          breadCrumbItems={breadCrumbItems}></SidebarListView>
      )}
    </div>
  )
})
