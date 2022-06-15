/* eslint-disable no-unused-vars */
export enum Role {
  SuperAdmin = 'bc98d523-f223-4ebc-9e22-3bcff32453ef',
  Admin = 'fd1d894f-87c2-40f4-948d-669873373148',
  User = 'e8d45e33-d959-4e69-a340-e4246d53472d',
}
export const Roles = [
  {
    id: 'e8d45e33-d959-4e69-a340-e4246d53472d',
    role: 'USER',
  },
  {
    id: 'fd1d894f-87c2-40f4-948d-669873373148',
    role: 'ADMIN',
  },
  {
    id: 'bc98d523-f223-4ebc-9e22-3bcff32453ef',
    role: 'SUPER ADMIN',
  },
]

export const RoleIds: Map = {
  'bc98d523-f223-4ebc-9e22-3bcff32453ef': 'Super admin',
  'fd1d894f-87c2-40f4-948d-669873373148': 'Admin',
  'e8d45e33-d959-4e69-a340-e4246d53472d': 'User',
}
interface Map {
  [key: string]: string | undefined
}
