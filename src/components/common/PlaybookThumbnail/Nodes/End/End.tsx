import { FC } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'

import { IconFlag } from './../../../Icons/Icons'

export const End: FC<NodeProps> = ({ id, xPos, yPos }) => {
  return (
    <div className='c-node node-end'>
      <div className='c-node__section'>
        <div className='c-node__content'>
          <div className='c-node__icon'>
            <img src={IconFlag} alt='End' />
            {/* <BuilderIcon name={`${getNormalize(data.name)}`} options={{ width: 55, height: 55 }} /> */}
            {/* <span style={{ top: 0, position: 'absolute' }}>{id}</span> <br />
            <div>
              <span>{xPos}</span>-<span>{yPos}</span>
            </div> */}
          </div>
        </div>
        <div className='c-node__text'>End</div>
      </div>
      <Handle type='target' position={Position.Top} id='a' />
    </div>
  )
}
