import { EllipsisOutlined } from '@ant-design/icons'
import { IconFilter } from 'components/common/Icons/Icons'
import { memo, FC } from 'react'
import { Handle, Position, NodeProps } from 'react-flow-renderer'

import { LogoService } from 'services/Utils/logo'

export const PlaybookThumbnail: FC<NodeProps> = ({ data, isConnectable }) => {
  const { isInitial, openModal, state } = data
  return (
    <div onClick={openModal}>
      {isInitial && <div className='thumbnail__label'>INITIAL TRIGGER</div>}
      <div className='thumbnail__content left--border' style={{ borderLeftColor: '#074851' }}>
        <div className='thumbnail__icon'>
          <img src={LogoService.getIcon('zendesk')} alt='' />
        </div>

        <div>
          If <strong>product usage </strong> for <strong>General ledger integration</strong> is{' '}
          <strong>less than 2x</strong> per <strong>week</strong> <strong>stateName:{state}</strong>
        </div>

        <EllipsisOutlined
          className='thumbnail__content--right'
          onClick={() => {
            alert('modal edit trigger')
          }}
        />
      </div>
      {isInitial && (
        <div
          className='thumbnail__filter'
          onClick={() => {
            alert('apply filter modal')
          }}>
          <img src={IconFilter} alt='Filters' /> <span className='filter--text'>filters applied</span>
        </div>
      )}
      <Handle type='target' position={Position.Top} id='a' isConnectable={isConnectable} />
      <Handle type='source' position={Position.Bottom} id='b' isConnectable={isConnectable} />
    </div>
  )
}

export default memo(PlaybookThumbnail)
