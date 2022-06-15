import { FC, useEffect, useState } from 'react'
import { Input } from 'antd'

import { SegmentDescriptionProps } from '../../PlaybookBuilderTypes'
import { IconPenUnderlined } from 'components/common/Icons/Icons'

export const SegmentDescription: FC<SegmentDescriptionProps> = (props: SegmentDescriptionProps) => {
  const { segmentBuilderData, visible } = props
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    if (editable && visible) {
      setEditable(!visible)
    }
  }, [visible])

  const textareaProps = {
    autoFocus: true,
    rows: 3,
    defaultValue: segmentBuilderData.description,
    maxLength: 256,
    onFocus: function (e: any) {
      var val = e.target.value
      e.target.value = ''
      e.target.value = val
    },
    onChange: (e: any) => {
      segmentBuilderData.description = e.currentTarget.value
    },
  }

  return (
    <div className={`segment-description__container ${editable ? 'active' : 'inactive'}`}>
      <span className='segment-description__container-title'>DESCRIPTION</span>
      <div className='segment-description__container-body'>
        {editable ? <Input.TextArea {...textareaProps} /> : <p>{segmentBuilderData.description}</p>}
        {!editable && <IconPenUnderlined onClick={(): void => setEditable(true)} />}
      </div>
    </div>
  )
}
