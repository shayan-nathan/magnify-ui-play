import { FC, useEffect } from 'react'
import { useState, DragEvent } from 'react'
import ReactFlow, {
  addEdge,
  Controls,
  Elements,
  Connection,
  Edge,
  EdgeTypesType,
  SmoothStepEdge,
  Background,
} from 'react-flow-renderer'
import { observer } from 'mobx-react-lite'
// import PlaybookThumbnail from 'components/common/PlaybookThumbnail/PlaybookThumbnail'
// TODO: remove PlaybookModal component
// import { PlaybookModal } from 'components/PlaybookModal/PlaybookModal'

import { EdgeSegment } from 'components/common/PlaybookThumbnail/EdgeSegment/EdgeSegment'
import { SegmentBuilder } from 'components/PlaybookBuilder/SegmentBuilder/SegmentBuilder'
import { useStore } from 'store'
import { useStore as useStoreFlow } from 'react-flow-renderer'
import { addNode, getMaxXPosition, getMaxYPosition, moveElementsPosition } from './playbookTargetUtils'

import { End, Segment } from 'components/common/PlaybookThumbnail/Nodes'
import useWindowSize from 'hooks/useWindowSize'
import { fragmentX, fragmentY } from './PlaybookTargetSettings'
interface PlaybookTargetProps {
  playbook: {
    name: string
    goal: string
    elements: Elements<any>
    visible: boolean
    segmentBuilderData: any
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    setElements: React.Dispatch<React.SetStateAction<Elements>>
    onShowDrawer: (data: any) => void
  }
}

const nodeTypes = {
  end: End,
  segment: Segment,
}
// TODO remove this when the playbook builder page won't have anymore the top header
// headerHeight 80px
// sidebarWidth 265px
const topHight = 80 + 63
const leftWidth = 265 + 25 + 60
const zoomOnElements = ['placeholder--area', 'edge__content', 'edge__button', 'plus-sign']
export const PlaybookTarget: FC<PlaybookTargetProps> = observer((props) => {
  const { elements, visible, segmentBuilderData, setVisible, setElements, onShowDrawer } = props.playbook
  const { playbookStore } = useStore()
  const { droppedElement, dragOverElement, setDropedElement } = playbookStore
  const storeFlow = useStoreFlow()
  const [goUp, setGoUp] = useState(false)
  const [wasUp, setWasUp] = useState(false)
  const [goDown, setGoDown] = useState(false)
  const { width, height } = useWindowSize()
  const [canvasHeight, setCanvasHeight] = useState(height - topHight)
  const [canvasWidth, setCanvasWidth] = useState(width - leftWidth)

  const onClose = () => {
    setVisible(false)
  }

  const onConnect = (params: Connection | Edge) => setElements((els: Elements) => addEdge(params, els))

  const needsToZoom = (classes: string, classesArray: Array<string>): boolean => {
    return Boolean(classesArray.find((item: string) => classes.includes(item)))
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    const targetElement = event?.target ? (event.target as HTMLElement) : null

    event.dataTransfer.dropEffect = 'copy'

    // Set addElement true only if it's dragged over a button
    if (targetElement?.className.length && needsToZoom(targetElement?.className, zoomOnElements)) {
      if (!targetElement.className.includes('c-zoom')) {
        // add the zoom class
        targetElement.className += ' c-zoom'
      }
      // TODO: this can be used for different pointer in the area where can be dropped
      // event.dataTransfer.dropEffect = 'move'
      if (!wasUp) {
        setGoDown(true)
        setGoUp(false)
        setWasUp(true)
      }
    } else {
      const elementsWithZoom: HTMLCollectionOf<Element> = document.getElementsByClassName('c-zoom')
      for (let index = 0; index < elementsWithZoom.length; index++) {
        const element = elementsWithZoom.item(index)
        // remove the zoom class
        element!.className = element!.className.replaceAll(' c-zoom', '')
      }
      if (wasUp) {
        setGoUp(true)
        setGoDown(false)
        setWasUp(false)
      }
    }
  }

  const edgeTypes: EdgeTypesType = {
    custom: EdgeSegment,
    smoothstep: SmoothStepEdge,
  }

  const updateElemenetsPosition = () => {
    if (dragOverElement && (goDown || goUp)) {
      const updatedPositionElements = moveElementsPosition(elements, dragOverElement, goDown)
      setElements(updatedPositionElements)
    }
  }

  // Move elements position based on hover over edge droppable section
  useEffect(() => {
    updateElemenetsPosition()
  }, [goUp, goDown])

  const onAddNode = () => {
    if (droppedElement) {
      const newStateElements = addNode(elements, droppedElement, {
        onShowDrawer,
        setElements,
      })
      setElements(newStateElements)
      setGoUp(false)
      setGoDown(false)
      setWasUp(false)
      setDropedElement(null)
    }
  }

  function OnWindowResize() {
    const { nodes } = storeFlow.getState()
    const maxX = getMaxXPosition(nodes)
    const maxY = getMaxYPosition(nodes)
    if (maxX + fragmentX > canvasWidth) {
      setCanvasWidth((canvasWidth) => canvasWidth + fragmentX)
    }
    if (maxY + fragmentY > canvasHeight) {
      setCanvasHeight((canvasHeight) => canvasHeight + fragmentY)
    }
  }

  useEffect(() => {
    onAddNode()
    OnWindowResize()
  }, [droppedElement])

  useEffect(() => {
    OnWindowResize()
  }, [width, height])

  return (
    <div className='playbook-flow'>
      <div className='flow-wrapper' style={{ width: `${width - leftWidth}px`, height: `${height - topHight}px` }}>
        <SegmentBuilder visible={visible} onClose={onClose} segmentBuilderData={segmentBuilderData} />
        <ReactFlow
          preventScrolling={false}
          elements={elements}
          onConnect={onConnect}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          arrowHeadColor={'#CDD0D8'}
          defaultZoom={1}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          panOnScroll={false}
          zoomOnScroll={false}
          paneMoveable={false}
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          snapGrid={[10, 10]}>
          <Controls showInteractive={false} showFitView={false} />
          <Background gap={24} />
          {/* <MiniMap /> */}
        </ReactFlow>
      </div>
    </div>
  )
})
