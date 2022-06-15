import { memo, FC } from 'react'
import { Handle, Position, NodeProps, useStoreState } from 'react-flow-renderer'
import { Button } from 'antd'

import { getNormalize } from 'services/Utils/parseString.utils'
import { BuilderIcon } from 'services/Utils/BuilderIcon'
import { getElementsAfterDeleteNode, getPlatformsToBeDisplayed } from './SegmentUtils'
import { IconTrash } from 'components/common/Icons/Icons'
import { getMenuItemIcon } from 'components/PlaybookBuilder/Utils/serviceUtils'

export const Segment: FC<NodeProps> = ({ data, selected, isConnectable, id, type, xPos, yPos }) => {
  const { onShowDrawer, setElements, isInitial, payload } = data
  const nodes = useStoreState((state) => state.nodes)
  const edges = useStoreState((state) => state.edges)

  const platforms = getPlatformsToBeDisplayed(payload)
  let platformLogoMargin = 0
  const defaultLogoMargin = 28

  const getDescriptionTopMargin = () => {
    const descriptionLength = data.description.length
    let defaultTopMargin = 12

    if (descriptionLength > 48 && descriptionLength < 96) defaultTopMargin = -2
    if (descriptionLength > 95) defaultTopMargin = -14

    return defaultTopMargin
  }

  return (
    <div className={`c-node c-${data.shape} ${selected ? 'active' : ''}`}>
      <div
        className='c-node__node-left'
        style={{ top: getDescriptionTopMargin() }}
        onClick={() => {
          onShowDrawer(data)
        }}>
        <div className='c-node__node-left__platforms'>
          {platforms.map((platform: string, index: number) => (
            <span
              key={index}
              style={{
                zIndex: platforms.length - index,
                marginLeft: index === 0 ? 0 : (platformLogoMargin += defaultLogoMargin),
              }}>
              {getMenuItemIcon({ entityType: 'platform', name: platform, data: [] }, true)}
            </span>
          ))}
        </div>
        <p>{data.description}</p>
      </div>

      <div
        className='c-node__section'
        onClick={() => {
          onShowDrawer(data)
        }}>
        <div className='c-node__content'>
          <div className='c-node__icon'>
            <BuilderIcon
              name={`${getNormalize(data.iconName)}`}
              options={{ width: 40, height: 40, draggable: false }}
            />

            {/* <p>{id}</p> */}
            {/* <br /> */}
            {/* <div style={{ position: 'absolute', backgroundColor: '#fff', top: '45px' }}>
              <span>{xPos}</span>-<span>{yPos}</span>
            </div> */}
          </div>
        </div>
      </div>

      {!isInitial ? (
        <Button
          className='delete-node'
          icon={<IconTrash />}
          onClick={() => {
            const elementsToUpdate = getElementsAfterDeleteNode(id, nodes, edges)

            setElements([...elementsToUpdate])
          }}></Button>
      ) : (
        <Button
          className='delete-node'
          icon={<IconTrash />}
          onClick={() => {
            alert('Reset segment criteria functionality')
          }}></Button>
      )}

      <Handle type='source' position={Position.Bottom} id='s-bottom' isConnectable={isConnectable} />
      <Handle type='source' position={Position.Right} id='s-right' isConnectable={isConnectable} />
      <Handle type='target' position={Position.Left} id='t-left' isConnectable={isConnectable} />
      <Handle type='target' position={Position.Top} id='t-top' isConnectable={isConnectable} />
    </div>
  )
}
export default memo(Segment)
