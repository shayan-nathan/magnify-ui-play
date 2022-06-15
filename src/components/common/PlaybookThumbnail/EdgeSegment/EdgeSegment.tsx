import { observer } from 'mobx-react-lite'
import { FC, DragEvent } from 'react'
import { EdgeProps, getEdgeCenter, getMarkerEnd, getSmoothStepPath } from 'react-flow-renderer'
import { useStore } from 'store'
export const EdgeSegment: FC<EdgeProps> = observer(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    arrowHeadType,
    markerEndId,
    target,
    data,
    source,
  }) => {
    const { playbookStore } = useStore()
    const { dragOverElement, setDragOverElement, setDropedElement } = playbookStore

    const edgePath = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId)

    // TODO Remove the logs when everything is working well
    const onEdgeDrop = (event: DragEvent, id: string) => {
      const dropObjectData = JSON.parse(event.dataTransfer.getData('application/json'))
      // console.log('dropObjectData', dropObjectData)

      const disabledActions: HTMLCollectionOf<Element> = document.getElementsByClassName('c-disabled')
      for (let index = 0; index < disabledActions.length; index++) {
        const element = disabledActions.item(index)
        // remove the zoom class
        element!.className = element!.className.replaceAll(' c-disabled', '')
      }
      const elementsWithZoom: HTMLCollectionOf<Element> = document.getElementsByClassName('c-zoom')
      for (let index = 0; index < elementsWithZoom.length; index++) {
        const element = elementsWithZoom.item(index)
        // remove the zoom class
        element!.className = element!.className.replaceAll(' c-zoom', '')
      }

      event.stopPropagation()
      // console.log('onEdgeDrop data', data)
      // console.log('onEdgeDrop target', target)
      // console.log('onEdgeDrop data', data)
      // console.log('onEdgeDrop sourceY', sourceY)
      // console.log('onEdgeDrop sourceX', sourceX)
      // console.log('onEdgeDrop targetX', targetX)
      // console.log('onEdgeDrop targetY', targetY)
      // console.log('onEdgeDrop targetY', sourcePosition)
      // console.log('onEdgeDrop targetY', targetPosition)

      const dropData = {
        id,
        source: source,
        target: target,
        data,
        ...dropObjectData,
      }
      setDropedElement(dropData)
    }

    const onEdgeDragOver = () => {
      if (dragOverElement?.source !== id) {
        setDragOverElement({ id, name: data.name, source, data, target, type: data.type, shape: data.shape })
      }
    }
    const foreignObjectSize = 200
    const nodeContentHeight = 68
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
    })
    const displayBorders = playbookStore.displayEdgeDrops ? 'edge--bordered' : ''
    const edgeShape = playbookStore.placeholderShape
    const xPosition = sourcePosition !== 'right' ? edgeCenterX - foreignObjectSize / 2 : targetX - foreignObjectSize / 2
    const yPosition =
      sourcePosition !== 'right'
        ? edgeCenterY - foreignObjectSize / 2
        : targetY - foreignObjectSize + nodeContentHeight / 2
    return (
      <>
        <path id={id} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={xPosition}
          y={yPosition}
          requiredExtensions='http://www.w3.org/1999/xhtml'>
          <div className='placeholder--area' onDrop={(event) => onEdgeDrop(event, id)} onDragOver={onEdgeDragOver}>
            <div className={`edge__content ${displayBorders} edge__content--${edgeShape}`}>
              {/* <span style={{ position: 'absolute', top: 'calc(50% - 15%)' }}>{data.edgeLabel}</span> */}
              <div className='edge__button'>
                <span className='plus-sign'></span>
                <span className='plus-sign'></span>
              </div>
              {/* <span style={{ zIndex: -2, position: 'absolute', top: '30%' }}>{id}</span> */}
            </div>
          </div>
        </foreignObject>
      </>
    )
  },
)
