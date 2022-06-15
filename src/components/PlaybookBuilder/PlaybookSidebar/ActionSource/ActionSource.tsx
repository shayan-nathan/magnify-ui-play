import { Button } from 'antd'
import { FC, DragEvent } from 'react'
import classNames from 'classnames'

import { getNormalize } from 'services/Utils/parseString.utils'
import { Action } from 'components/PlaybookBuilder/PlaybookBuilderTypes'
import { useStore } from 'store'
import { BuilderIcon } from 'services/Utils/BuilderIcon'

interface ActionSourceProps {
  action: Action
}

export const ActionSource: FC<ActionSourceProps> = (props: ActionSourceProps) => {
  const { action } = props
  const shape = action.shape

  const { playbookStore } = useStore()

  const onDragStart = (event: DragEvent, nodeType: string) => {
    playbookStore.setDisplayEdgeDrops(true)
    playbookStore.setPlaceholderShape(shape)
    event.currentTarget.className += ' c-disabled'
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('application/json', JSON.stringify(action))
    event.dataTransfer.effectAllowed = 'copy'
  }

  const onDragEnd = (event: DragEvent) => {
    // console.log('drag end', event)
    playbookStore.setDisplayEdgeDrops(false)
    event.currentTarget.className = event.currentTarget.className.replaceAll(' c-disabled', '')
  }

  return (
    <div
      className='action-source'
      data-testid='action-source'
      draggable
      onDragStart={(event: DragEvent) => onDragStart(event, 'segment')}
      onDragEnd={(event: DragEvent) => {
        return onDragEnd(event)
      }}>
      <div className='action-btn--box' data-testid='source-box'>
        <Button className={classNames([`c-targeting c-targeting--${shape || 'square'}`])} data-testid='source-btn'>
          <BuilderIcon name={`${getNormalize(action.type)}`} options={{ width: 22, height: 22 }} />
          {/* {!loading && <img src={`${image}`} alt={action.name} draggable={false} data-testid='source-image' />} */}
        </Button>
      </div>
      <div className='source-name' data-testid='source-name'>
        <span>{action.name}</span>
      </div>
    </div>
  )
}
