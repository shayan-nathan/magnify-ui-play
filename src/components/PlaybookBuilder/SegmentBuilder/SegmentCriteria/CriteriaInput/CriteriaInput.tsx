import React, { useState } from 'react'
import { Input, Select } from 'antd'

import { generateInputs, getElementSelectOptions, getMenuItemIcon } from '../../../Utils/serviceUtils'
import { DropdownArrowDown } from '../../../../common/Icons/Icons'
import { SelectOptions } from 'components/PlaybookBuilder/PlaybookBuilderTypes'
import { getRandomId } from 'services/Utils/dslConversion'

const { Option } = Select

interface CriteriaInputProps {
  item: any
}

export const CriteriaInput: React.FC<CriteriaInputProps> = ({ item }) => {
  const selectOptions = getElementSelectOptions(item.type)
  const [inputIsRange, setInputIsRange] = useState(item.operator === 'between')

  const updateValue = (inputType: any, newVal: any) => {
    //todo: for debugging purposes
    console.log('value before change', item.value)

    switch (inputType) {
      case 'num':
        item.value = newVal
        break
      case 'str':
        item.value = newVal.target.value
        break
      case 'num_min':
        //todo: I think we don't have to overwrite the value of the item just in case the user changes
        // their mind and they would need the old value back
        item.value[0] = newVal
        break
      case 'num_max':
        item.value[1] = newVal
        break
    }

    //todo: for debugging purposes
    console.log('value after change', item.value)
  }

  const [displayedInputs, updateInputs] = useState(generateInputs(item, inputIsRange, updateValue))

  const changeInputConditions = (e: any) => {
    // only regenerate inputs if the input type has changed
    console.log('item value', item.value)
    item.operator = e
    if (!inputIsRange && e === 'between') {
      setInputIsRange(true)
      updateInputs(generateInputs(item, true, updateValue))
      item.value = [null, null]
    } else if (inputIsRange && e !== 'between') {
      setInputIsRange(false)
      updateInputs(generateInputs(item, false, updateValue))
      item.value = ''
    }
  }

  function getLabelOption(selectOptions: SelectOptions[], type: string) {
    if (!type) {
      return selectOptions[0]?.label
    }
    const defaultItem = selectOptions.filter((item) => item.value === type)
    return defaultItem[0].label || selectOptions[0]?.label
  }

  return (
    <div draggable={false}>
      <span className='group-container__item-container__item-title' draggable={false}>
        {getMenuItemIcon({ entityType: 'platform', name: item.platform, data: [] }, true)}
        {item.field}
      </span>
      <div className='group-container__item-container__item'>
        <div className='group-container__item-container__item__select-input-range'>
          <Input.Group compact className='criteria-input-group'>
            <Select
              size='large'
              key={getRandomId()}
              dropdownClassName='group-container__item-container__item__select-input-range__dropdown'
              suffixIcon={<DropdownArrowDown />}
              defaultValue={getLabelOption(selectOptions, item.operator)}
              autoFocus={!item.operator}
              defaultOpen={!item.operator}
              onChange={changeInputConditions}>
              {selectOptions.map((option, index) => (
                <Option key={index} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {displayedInputs}
          </Input.Group>
        </div>
      </div>
    </div>
  )
}
