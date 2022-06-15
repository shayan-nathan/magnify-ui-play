export interface User {
  username: string | null
  email: string | null
  roleId?: string
  role?: string
  name?: string | null
  groupIds?: string[]
  groups?: GenericGroup[]
  tenantId?: string | null
  email_verified?: string | null
  sub?: string | null
  status?: string | null
  created_at?: string
}
export interface UserPost {
  username: string | null
  email: string | null
  roleId: string | null
  groupIds: string[] | null
}
export interface UserUpdate {
  roleId: string | null
  groupIds: string[] | null
}
export interface GenericGroup {
  id: string
  groupName: string
}
export interface Role {
  id: string
  role: string
}
export interface Group extends GenericGroup {
  membersNo?: number
  createdAt: string
  createdBy?: string
  isDisabled?: boolean
  tenantId?: string
}
export interface GroupPost {
  groupName: string
}
