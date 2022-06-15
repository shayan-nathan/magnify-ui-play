import { Input, InputNumber } from 'antd'
import React from 'react'

import { LogoService } from 'services/Utils/logo'
import { DropdownArrowDown, IconBox } from 'components/common/Icons/Icons'
import { getNormalize } from 'services/Utils/parseString.utils'
import { MetadataDescription } from 'models'
import { SelectOptions } from '../PlaybookBuilderTypes'

const getMenuItemIcon = (item: MetadataDescription, includeObjectIcon?: boolean): JSX.Element | null => {
  let icon
  switch (item.entityType) {
    case 'platform':
      icon = <img key={item.name} src={LogoService.getIcon(getNormalize(item.name))} alt={item.name} />
      break
    case 'object':
      icon = includeObjectIcon ? <IconBox /> : null
      break
    default:
      icon = null
      break
  }
  return icon
}

const getElementSelectOptions = (type: string) => {
  let options: SelectOptions[] = []

  switch (type) {
    case 'int':
    case 'number':
    case 'currency':
    case 'double':
      options = [
        { label: '< Less than', value: 'lessThan' },
        { label: '<= Equals or less than', value: 'equalsOrLessThan' },
        { label: '= Equals', value: 'equals' },
        { label: '>= Equals or greater than', value: 'equalsOrGreaterThan' },
        { label: '> Greater than', value: 'greaterThan' },
        { label: '<> Between', value: 'between' },
      ]
      break
    case 'url':
    case 'id':
    case 'textarea':
    case 'address':
    case 'string':
    case 'phone':
    case 'reference':
      options = [
        { label: 'Contains', value: 'contains' },
        { label: 'Equals', value: 'equals' },
        { label: 'Not contains', value: 'notContains' },
      ]
      break
    case 'range':
      options = [{ label: 'Between', value: 'between' }]
      break
    case 'picklist':
    case 'boolean':
    case 'collection':
      options = [
        { label: 'Include', value: 'include' },
        { label: 'Not include', value: 'notInclude' },
      ]
      break
    case 'date':
    case 'datetime':
    case 'datepicker':
      options = [
        { label: 'Is on', value: 'isOn' },
        { label: 'Is before/on', value: 'isBeforeOn' },
        { label: 'Is after/on', value: 'isAfterOn' },
      ]
      break
    default:
      break
  }

  return options
}

const generateInputs = (item: any, range: boolean, updateValue: any) => {
  switch (item.type) {
    case 'int':
    case 'number':
    case 'currency':
    case 'double':
      return !range ? (
        <InputNumber
          size='large'
          onChange={(e) => {
            updateValue('num', e)
          }}
          defaultValue={item.value}
          controls={{ upIcon: <DropdownArrowDown />, downIcon: <DropdownArrowDown /> }}
        />
      ) : (
        <>
          <InputNumber
            size='large'
            className='range-number-input-min'
            placeholder='Minimum'
            onChange={(e) => {
              updateValue('num_min', e)
            }}
            defaultValue={item.value[0]}
            controls={{ upIcon: <DropdownArrowDown />, downIcon: <DropdownArrowDown /> }}
          />
          <InputNumber
            size='large'
            className='site-input-right range-number-input-max'
            placeholder='Maximum'
            onChange={(e) => {
              updateValue('num_max', e)
            }}
            defaultValue={item.value[1]}
            controls={{ upIcon: <DropdownArrowDown />, downIcon: <DropdownArrowDown /> }}
          />
        </>
      )
    case 'string':
      return (
        <Input
          size='large'
          onChange={(e) => {
            updateValue('str', e)
          }}
          defaultValue={item.value}
        />
      )
    default:
      return <Input size='large' placeholder='work in progress...' />
  }
}

export { getMenuItemIcon, getElementSelectOptions, generateInputs }
