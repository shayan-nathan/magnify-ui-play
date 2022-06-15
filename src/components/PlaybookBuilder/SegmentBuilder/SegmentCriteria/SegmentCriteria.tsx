import { Layout } from 'antd'
import { FC } from 'react'
import { DragAndDrop, PlaceholderForward } from 'components/common/Icons/Icons'

import { SegmentCriteriaProps } from '../../PlaybookBuilderTypes'
import { CriteriaInput } from './CriteriaInput/CriteriaInput'
import { getRandomId } from 'services/Utils/dslConversion'

export const SegmentCriteria: FC<SegmentCriteriaProps> = (props: SegmentCriteriaProps) => {
  const {
    segmentBuilderData,
    dragEvents,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    onDragEnterGroup,
    onDragLeaveGroup,
    onDragOverGroup,
    onDragEnterPlaceholder,
    onDragLeavePlaceholder,
    onDragOverPlaceholder,
  } = props

  const isDefaultGroup = dragEvents?.isDragStarting && dragEvents?.groupCounter === 0

  const isInitialView = !segmentBuilderData?.groups?.length && !dragEvents?.isDragStarting

  const isActiveGroup = (groupIndex: number): boolean => {
    return dragEvents?.isDragStarting && dragEvents?.dragOverGroup === groupIndex && dragEvents?.groupCounter !== 0
  }

  const isLastItemOfActiveGroup = (groupIndex: number, itemIndex: number, itemsLength: number): boolean => {
    return (
      dragEvents?.isDragStarting &&
      dragEvents?.dragOverGroup === groupIndex &&
      dragEvents?.groupCounter !== 0 &&
      itemIndex === itemsLength
    )
  }

  const displayLogicalOperator = (groupIndex: number, itemIndex: number, groupLength: number): boolean => {
    return (
      (groupIndex !== segmentBuilderData.groups.length - 1 || dragEvents?.isDragStarting) && itemIndex === groupLength
    )
  }

  const displayLogicalOperatorBetweenGroups = (groupIndex: number): boolean => {
    return (
      dragEvents?.isDragStarting &&
      dragEvents?.groupCounter === 0 &&
      groupIndex === segmentBuilderData.groups.length - 1
    )
  }

  const isPlaceholderOfActiveGroup = (groupIndex: number, itemIndex: number, groupLength: number): boolean => {
    return dragEvents?.isDragStarting && itemIndex === groupLength && dragEvents?.dragOverGroup === groupIndex
  }

  const isDraggedOver = (groupIndex: number): boolean => {
    return dragEvents?.dragOverGroup === groupIndex && dragEvents?.groupCounter !== 0
  }

  return (
    <Layout
      className='segment-builder__criteria'
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}>
      {!!segmentBuilderData?.groups?.length &&
        segmentBuilderData.groups.map((group: any, groupIndex: number) => (
          <div
            key={groupIndex}
            onDragEnter={(e) => onDragEnterGroup(e, groupIndex)}
            onDragLeave={(e) => onDragLeaveGroup(e, groupIndex)}
            onDragOver={(e) => onDragOverGroup(e)}
            className={`group-container ${
              isActiveGroup(groupIndex) ? 'group-container__active' : 'group-container__inactive'
            } ${
              dragEvents?.isDragStarting
                ? isDraggedOver(groupIndex)
                  ? 'group-container__on-drag-over-group'
                  : 'group-container__on-drag-start'
                : 'group-container__on-drag-end'
            }`}>
            <div>
              {group.groups.map((item: any, itemIndex: number) => (
                <div className='group-container__item-container' key={itemIndex}>
                  <CriteriaInput key={getRandomId()} item={item} />

                  <span
                    className={`group-container__group-operator ${
                      !dragEvents?.isDragStarting && itemIndex === group.groups.length - 1
                        ? 'group-container__group-operator__toggle'
                        : ''
                    } ${
                      isLastItemOfActiveGroup(groupIndex, itemIndex, group.groups.length - 1)
                        ? 'group-container__group-operator__active'
                        : dragEvents?.isDragStarting
                        ? 'group-container__group-operator__inactive'
                        : 'group-container__group-operator__default'
                    }`}>
                    AND
                  </span>
                  {isLastItemOfActiveGroup(groupIndex, itemIndex, group.groups.length - 1) ? (
                    <div
                      className={`group-container__placeholder ${
                        isPlaceholderOfActiveGroup(groupIndex, itemIndex, group.groups.length - 1)
                          ? 'group-container__placeholder__group'
                          : 'group-container__placeholder__toggle'
                      } `}>
                      <div></div>
                    </div>
                  ) : null}
                  {displayLogicalOperator(groupIndex, itemIndex, group.groups.length - 1) && (
                    <div
                      className={`group-container__between-groups ${
                        displayLogicalOperatorBetweenGroups(groupIndex)
                          ? 'group-container__between-groups__default-drop-area'
                          : dragEvents?.isDragStarting
                          ? isActiveGroup(groupIndex)
                            ? 'group-container__between-groups__active-group'
                            : 'group-container__between-groups__inactive-group'
                          : 'group-container__between-groups__default'
                      }`}>
                      <span>
                        <hr />
                      </span>

                      <span className='group-container__between-groups__title'>OR</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      {isDefaultGroup && (
        <div
          onDragEnter={(e) => onDragEnterPlaceholder(e)}
          onDragLeave={(e) => onDragLeavePlaceholder(e)}
          onDragOver={onDragOverPlaceholder}
          className={`group-container__placeholder group-container__placeholder__${
            dragEvents.placeholderCounter || segmentBuilderData?.groups?.length
              ? 'active'
              : !segmentBuilderData?.groups?.length
              ? 'default'
              : ''
          }`}>
          <div>
            {!!!dragEvents.placeholderCounter && !!!segmentBuilderData?.groups?.length && (
              <span>
                <PlaceholderForward />
                Drop it here
              </span>
            )}
          </div>
        </div>
      )}
      {isInitialView && (
        <div className='segment-builder__criteria__initial-view'>
          <DragAndDrop />
          <span>Drag data attributes from data sources of integrations to build your statement</span>
        </div>
      )}
    </Layout>
  )
}
