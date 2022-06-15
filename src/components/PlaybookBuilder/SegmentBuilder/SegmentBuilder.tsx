import { Drawer, Layout, Row } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import { FC, DragEvent, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'

import { Heading } from 'components/common'
import { IconXMark, IconPersons } from 'components/common/Icons/Icons'
import { SegmentSidebar } from './SegmentSidebar/SegmentSidebar'
import { SegmentCriteria } from './SegmentCriteria/SegmentCriteria'
import { SegmentDescription } from './SegmentDescription/SegmentDescription'
import { mockData } from './SegmentBuilderMockData'

import { SegmentBuilderProps, SourceData, DragEvents, Groups, Item } from '../PlaybookBuilderTypes'

export const SegmentBuilder: FC<SegmentBuilderProps> = observer((props: SegmentBuilderProps) => {
  const { visible, onClose, segmentBuilderData } = props
  const [dragData, setDragData] = useState<Item>()

  const [dragEvents, setDragEvents] = useState<DragEvents>({
    isDragStarting: false,
    dragOverGroup: undefined,
    groupCounter: 0,
    placeholderCounter: 0,
  })

  const { metadataStore } = useStore()

  useEffect(() => {
    metadataStore.get()
  }, [])
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: SourceData, breadCrumbItem: any[], position: any) => {
    if ((e as any).target.className !== 'menu__item') {
      return
    }

    e.dataTransfer.setData('id', position)

    const data: Item = {
      platform: breadCrumbItem[0]?.name,
      object: breadCrumbItem[breadCrumbItem.length - 1]?.name,
      type: item.type,
      field: item.name,
      operator: '',
      value: '',
      isNewStatement: true,
    }

    ////////////////////////////////////////////////////////////////////////////////////
    /* CREATE GHOST ELEMENT WHEN DRAGGING THE ITEM */
    /* TO DO: TRANSFORM JS ELEMENTS TO REACT ELEMENTS */
    ////////////////////////////////////////////////////////////////////////////////////
    // const ghostElement = document.createElement('div')
    // const childElement = document.createElement('div')
    // let spanElement = document.createElement('span')
    // ghostElement.setAttribute('id', 'ghost-element')
    // childElement.classList.add('ghost-element')
    // childElement.innerHTML = item.name

    // ghostElement.style.cssText = `
    //   width: 280px;
    //   height: 65px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   vertical-align: middle;
    //   position: absolute;
    //   top: -150px;
    // `

    // childElement.style.cssText = `
    //   border: 1px solid #EBEBEB;
    //   background-color: #FFFFFFF;
    //   box-shadow: -4px 0px 16px rgba(0, 0, 0, 0.08);
    //   border-radius: 5px;
    //   margin: 0 auto;
    //   width: 256px;
    //   height: 52px;
    // `
    // ghostElement.appendChild(childElement)
    // document.body.appendChild(ghostElement)

    // function getOffset() {
    //   const rect = (e.target as HTMLElement).getBoundingClientRect()
    //   return {
    //     x: e.clientX - rect.left,
    //     y: e.clientY - rect.top,
    //   }
    // }
    // e.dataTransfer.setDragImage(ghostElement, getOffset().x, getOffset().y)

    setDragEvents((drag) => {
      return { ...drag, isDragStarting: true }
    })
    setDragData(data)
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => {}

  const handleDragLeave = (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => {}

  const onDragEnterGroup = (e: React.DragEvent<HTMLDivElement>, group?: any) => {
    setDragEvents((drag) => {
      return { ...drag, dragOverGroup: group, groupCounter: drag.groupCounter + 1 }
    })
  }

  const onDragLeaveGroup = (e: React.DragEvent<HTMLDivElement>, group?: any) => {
    setDragEvents((drag) => {
      return { ...drag, groupCounter: drag.groupCounter - 1 }
    })
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => {
    e.preventDefault()

    ////////////////////////////////////////////////////////////////////////////////////
    /* REMOVE GHOST ELEMENT */
    ////////////////////////////////////////////////////////////////////////////////////
    // const ghostElement = document.getElementById('ghost-element')
    // ghostElement?.remove()
  }

  const onDragOverGroup = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragEnd = (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => {
    setDragEvents((drag) => {
      return { ...drag, isDragStarting: false, groupCounter: 0, placeholderCounter: 0 }
    })
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => {
    setDragEvents((drag) => {
      return { ...drag, isDragStarting: false, placeholderCounter: 0 }
    })

    if (dragData?.isNewStatement) {
      dragData.isNewStatement = false
      addStatement(dragData, dragEvents.dragOverGroup)
    }
  }

  const onDragEnterPlaceholder = (e: DragEvent<HTMLDivElement>) => {
    setDragEvents((drag) => {
      return { ...drag, placeholderCounter: drag.placeholderCounter + 1 }
    })
  }

  const onDragLeavePlaceholder = (e: DragEvent<HTMLDivElement>) => {
    setDragEvents((drag) => {
      return { ...drag, placeholderCounter: 0 }
    })
  }

  const onDragOverPlaceholder = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const addStatement = (item: Item, groupIndex?: number) => {
    if (!segmentBuilderData.payload?.groups?.length) {
      segmentBuilderData.payload.groups = [{ groups: [item], relationOperator: 'AND' }]
    } else {
      setDragEvents((drag) => {
        return { ...drag, dragOverGroup: undefined }
      })

      segmentBuilderData.payload.groups.map((statement: Groups, statementIndex: number) => {
        if (statementIndex === groupIndex && dragEvents?.groupCounter !== 0) {
          setDragEvents((drag) => {
            return { ...drag, groupCounter: 0 }
          })
          statement.groups.push(item)
        }
        return statement
      })

      if ((groupIndex || groupIndex === 0) && dragEvents?.groupCounter !== 0) {
        return segmentBuilderData
      } else {
        setDragEvents((drag) => {
          return { ...drag, groupCounter: 0 }
        })
        segmentBuilderData.payload.groups.push({ groups: [item], relationOperator: 'AND' })
      }
    }
  }

  return (
    <div id='segment-builder'>
      <Drawer
        placement='right'
        visible={visible}
        size='large'
        onClose={onClose}
        className='segment-builder'
        closable={false}>
        <Row>
          <div className='heading grow'>
            <IconPersons />
            <h1 className='segment__name'>{segmentBuilderData.name}</h1>
          </div>

          <IconXMark onClick={onClose} className='close__btn' />
        </Row>

        <Layout style={{ flexDirection: 'row', maxHeight: 690, marginTop: 30 }}>
          <Sider width={290} className='segment-builder__sider'>
            <Heading level='2' variant='6'>
              Data Source
            </Heading>
            <SegmentSidebar
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragEnter={handleDragEnter}
            />
          </Sider>

          <Layout>
            <Row>
              <Heading level='2' variant='6' className='grow'>
                If statement
              </Heading>
            </Row>

            <SegmentCriteria
              data={mockData}
              dragEvents={dragEvents}
              segmentBuilderData={segmentBuilderData.payload}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnter={handleDragEnter}
              onDragEnterGroup={onDragEnterGroup}
              onDragLeaveGroup={onDragLeaveGroup}
              onDragOverGroup={onDragOverGroup}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              onDragEnterPlaceholder={onDragEnterPlaceholder}
              onDragLeavePlaceholder={onDragLeavePlaceholder}
              onDragOverPlaceholder={onDragOverPlaceholder}
            />
          </Layout>
        </Layout>
        <SegmentDescription visible={visible} segmentBuilderData={segmentBuilderData} />
        <div>Bottom elements here</div>
      </Drawer>
    </div>
  )
})
