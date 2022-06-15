export type variant = '1' | '2' | '3' | '4' | '5' | '6'
export interface ErrorMesage {
  message: string
  name: string
  code: string
}
export * from './metadata.model'
export * from './Integration.model'
export * from './insights'
export * from './notification.model'
export * from './playbook.model'
export * from './source.model'
export * from './tenant'
export * from './users.model'
