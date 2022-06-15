import { Group, Role, User } from 'models/users.model'

export const getRoleName = (id: string | undefined, roles: Role[]) => {
  if (!Object.keys(roles).length) {
    return
  }
  const roleObj = roles.find((role: Role) => role.id === id)
  // the super Admin doesn't have an available role
  return roleObj?.role ? roleObj?.role : 'SUPER ADMIN'
}

export const getGroupName = (userGroups: string[] | undefined, groups: Group[]) => {
  if (!groups.length || !Object.keys(groups).length) {
    return
  }

  const groupNames: string[] = []
  groups.map((group) => {
    if (userGroups?.length) {
      return userGroups.find((userId) => {
        if (userId === group.id) {
          groupNames.push(group.groupName)
        }
        return userId === group.id
      })
    } else return 'no groups'
  })

  if (groupNames.length) {
    return groupNames
  }
  if (!userGroups) {
    return ['All groups']
  }
}

export const getMembers = (groupId: string, usersStore: User[], roles: Role[], groups: Group[]) => {
  let users: any[] = []
  usersStore.forEach((user) => {
    if (user.groupIds?.length && user.groupIds?.indexOf(groupId) !== -1) {
      users.push({
        key: user.username,
        username: user.username,
        email: user.email,
        role: getRoleName(user.roleId, roles),
        group: getGroupName(user.groupIds, groups),
      })
    }
  })
  return users
}
