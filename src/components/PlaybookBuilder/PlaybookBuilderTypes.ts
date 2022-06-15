import { DragEvent } from 'react'
import { Node } from 'react-flow-renderer'

import { MetadataDescription } from 'models/metadata.model'

export type shapeType = 'circle' | 'rhomb' | 'square'
export interface Action {
  name: string
  type: string
  shape: shapeType | string
  platform?: string
  iconName?: string
  payload?: SegmentBuilderData | {}
  description?: string
}
export interface Platform {
  name: string
  type: string
  actions: Action[]
}
export interface PlaybookActionsType {
  targeting: Action[]
  rules: Action[]
  actions?: Platform[]
}

export interface LooseObject {
  [key: string]: any
}
export interface BuilderAction extends Action {
  id: string
  source: string
  target: string
  data: {
    [k: string]: any
  }
}

interface SegmentBuilderProps {
  visible: boolean
  onClose: () => void
  segmentBuilderData: any
}

interface SegmentSidebarProps {
  handleDragStart: (e: DragEvent<HTMLDivElement>, item: SourceData, breadCrumbItem: any[], position: any) => void
  handleDragEnter: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  handleDragEnd: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  handleDragOver: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
}

interface SegmentCriteriaProps {
  data: any
  dragEvents: DragEvents
  segmentBuilderData: any
  handleDragStart: (e: DragEvent<HTMLDivElement>, item: SourceData, breadCrumbItem: any[], position: any) => void
  handleDragEnter: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  onDragEnterGroup: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
  onDragLeaveGroup: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
  onDragOverGroup: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
  handleDragLeave: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  handleDragOver: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  handleDrop: (e: DragEvent<HTMLDivElement>, item?: SourceData, position?: any) => void
  onDragEnterPlaceholder: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
  onDragLeavePlaceholder: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
  onDragOverPlaceholder: (e: DragEvent<HTMLDivElement>, group?: number | null) => void
}

interface breadcrumbInfo extends MetadataDescription {
  path: string[]
}

interface SourceData {
  name: string
  type?: string
  fields?: SourceData[]
}

interface Breadcrumb {
  name: string
  type: string
  path: string[]
}

interface DragItemEvent {
  name: string
  item: SourceData
}

interface Field5 {
  name: string
  type: string
  fields: any[]
}

interface Field4 {
  name: string
  type: string
  fields: Field5[]
}

interface Field3 {
  name: string
  type: string
  fields: Field4[]
}

interface Field2 {
  name: string
  type?: string
  fields?: Field3[]
}

interface Field {
  name: string
  type?: string
  fields?: Field2[]
}

interface mockDataItems {
  name: string
  type: string
  fieldType?: string
  fields: Field[]
}
interface CreateEdgeProps {
  parentNode: Node
  childNode: Node | string
  dropEdge?: BuilderAction | string
  isOnNoBranch?: boolean
}

interface DragEvents {
  isDragStarting: boolean
  dragOverGroup: number | undefined
  groupCounter: number
  placeholderCounter: number
}

interface SegmentBuilderData {
  groups: Groups[]
  relationOperator: string
}

interface Groups {
  groups: Item[]
  relationOperator: string
}

interface Item {
  platform: string
  object: string
  type: string | undefined
  field: string | undefined
  operator: string
  value: string
  isNewStatement: boolean
}
interface SelectOptions {
  label: string
  value: string
}

interface SegmentDescriptionProps {
  segmentBuilderData: Action
  visible: boolean
}

export type {
  SegmentSidebarProps,
  breadcrumbInfo,
  SourceData,
  SegmentBuilderProps,
  CreateEdgeProps,
  SegmentCriteriaProps,
  DragItemEvent,
  mockDataItems,
  DragEvents,
  SegmentBuilderData,
  Groups,
  Item,
  SelectOptions,
  SegmentDescriptionProps,
}
