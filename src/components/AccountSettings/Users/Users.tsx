import { Alert, Button, Dropdown, Form, Input, Menu, message, Modal, Row, Select, Spin, Table } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import dayjs from 'dayjs'
import { useEffectOnce } from 'react-use'

import { Heading } from 'components/common'
import { useStore } from 'store'
import { ErrorMesage } from 'models'
import { User, UserPost } from 'models/users.model'
import { getGroupName, getRoleName } from 'services/Utils/users.service'
import { Patterns } from 'services/Utils/Patterns'
import { Roles } from 'services/Utils/Role'

interface UsersProps {}

export const Users: FC<UsersProps> = observer(() => {
  const { userStore } = useStore()
  const { isLoading } = userStore

  const { Option } = Select
  const [form] = Form.useForm()
  const [isAddUsersModalVisible, setIsAddUsersModalVisible] = useState(false)
  const [isDeleteUsersModalVisible, setIsDeleteUsersModalVisible] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>('')
  const [error, setError] = useState<ErrorMesage | null>(null)
  const [userGroupsId, setUserGroupsId] = useState<string[] | []>([])

  const { getAll, getRoles, getGroups } = userStore

  useEffectOnce(() => {
    getRoles()
    getAll()
    getGroups()
  })

  const getRoleId = (name: string | undefined | null) => {
    const roleObj = userStore.roles.find((role) => {
      return name === role.role
    })
    return roleObj?.id ? roleObj?.id : 'hardcoded'
  }

  const getGroupId = (name: string | undefined | null) => {
    const groupObj = userStore.groups.find((group) => {
      return name === group.groupName
    })
    return groupObj?.id ? groupObj?.id : null
  }

  const users = userStore.users.map((user) => {
    return {
      key: user.username,
      username: user.username,
      email: user.email,
      role: getRoleName(user.roleId, Roles),
      groups: getGroupName(user.groupIds, userStore.groups),
      status:
        user.status === 'FORCE_CHANGE_PASSWORD' ? `Invite sent ${dayjs(user.created_at).format('MM/DD')}` : user.status,
    }
  })

  const deleteUser = async (username: string | null) => {
    if (username) {
      await userStore.remove(username)
      handleDeleteUserCancel()
      message.success('User deleted successfully', 4)
    }
  }

  const deleteMenu = (user: User) => (
    <Menu>
      <Menu.Item
        key='1'
        onClick={() => {
          showDeleteModal()
          setUserToDelete(user.username)
        }}>
        Delete user
      </Menu.Item>
    </Menu>
  )

  const groupsOptions = userStore.groups.map((group) => (
    <Option key={group.id} value={group.groupName}>
      {group.groupName}
    </Option>
  ))
  const rolesOptions = userStore.roles.map((role) => (
    <Option key={role.id} value={role.id}>
      {role.role}
    </Option>
  ))

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => {
        return a.username.localeCompare(b.username)
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (item: any, record: any) => {
        return (
          <Select
            defaultValue={item}
            style={{ width: '100%' }}
            disabled={record.role === 'SUPER ADMIN'}
            onChange={(selectValue) => {
              handleUpdateRole(record, selectValue)
            }}>
            {rolesOptions}
          </Select>
        )
      },
    },
    {
      title: 'Group',
      dataIndex: 'groups',
      width: 300,
      render: (item: any, record: any) => {
        return (
          <Select
            mode='multiple'
            defaultValue={item}
            disabled={record.role === 'SUPER ADMIN'}
            style={{ width: '100%' }}
            onChange={(selectValue) => {
              handleUpdateGroup(record, selectValue)
            }}
            maxTagCount='responsive'>
            {groupsOptions}
          </Select>
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: '',
      dataIndex: '',
      render: (item: any) => {
        return (
          <Dropdown.Button overlay={deleteMenu(item)} className='c-drop-down' trigger={['click']}></Dropdown.Button>
        )
      },
    },
  ]

  const addNewUser = async () => {
    try {
      const values = await form.validateFields()
      const { username, email, roleId }: UserPost = values
      const groupIds = userGroupsId
      const data = {
        username,
        email,
        roleId,
        groupIds,
      }

      const newUser = await userStore.post(data)
      if (newUser.created_at) {
        handleAddUsersCancel()
        message.success('User added successfully', 4)
      } else {
        message.error(newUser.response.data.errorMessage, 4)
        setError(newUser)
      }
    } catch (error: any) {
      if (error.errorFields) {
        setError({ message: 'The form is invalid!', name: 'error', code: 'error' })
      } else {
        message.error(error.message, 4)
        setError(error)
      }
    }
  }

  const showAddModal = () => {
    setIsAddUsersModalVisible(true)
  }
  const handleAddUsersCancel = () => {
    form.resetFields()
    setIsAddUsersModalVisible(false)
    setError(null)
    setUserGroupsId([])
  }

  const showDeleteModal = () => {
    setIsDeleteUsersModalVisible(true)
  }
  const handleDeleteUserCancel = () => {
    setIsDeleteUsersModalVisible(false)
  }

  const handleUpdateRole = async (record: any, newRole: string) => {
    const groupIds = record.groups ? record.groups.map((group: string) => getGroupId(group) || group) : []
    const updatedUser = { username: record.username, roleId: newRole, groupIds }

    const { response } = await userStore.update(updatedUser)
    if (!response?.data?.errorMessage) {
      message.success('User updated successfully!', 4)
      return
    }
    message.error('User update failed!', 4)
  }

  const handleUpdateGroup = async (record: User, newGroup: string[]) => {
    const groups = newGroup.map((group) => getGroupId(group) || group)
    const updatedUser = { username: record.username, roleId: getRoleId(record.role), groupIds: groups }
    const { response } = await userStore.update(updatedUser)
    if (!response?.data?.errorMessage) {
      message.success('User updated successfully!', 4)
      return
    }
    message.error('User update failed!', 4)
  }
  const handleSelectGroup = (groups: string[]) => {
    const groupsIds = groups.map((group) => getGroupId(group) || group)
    setUserGroupsId(groupsIds)
  }
  return (
    <div className='users'>
      <Row align='middle' className='m-b-20'>
        <Heading level='3' variant='1'>
          Manage users
        </Heading>
        <div className='c-button--right'>
          <Button key='submit' htmlType='submit' className='c-button--1' onClick={showAddModal}>
            + Add new user
          </Button>
        </div>
      </Row>

      <Spin size='large' spinning={isLoading}></Spin>

      {/* Add users modal */}
      <Modal
        title='Add new user'
        visible={isAddUsersModalVisible}
        onCancel={handleAddUsersCancel}
        width={656}
        footer={[
          <Button key='submit' htmlType='submit' className='c-button--1' onClick={addNewUser}>
            Save
          </Button>,
        ]}>
        <Form
          form={form}
          name='add_user_form'
          labelCol={{
            span: 10,
          }}
          autoComplete='off'>
          <Form.Item
            label='Username'
            name='username'
            colon={false}
            labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
            wrapperCol={{ md: 12 }}
            rules={[
              {
                required: true,
                message: 'Please input the username!',
                pattern: new RegExp(Patterns.username),
              },
            ]}>
            <Input autoComplete='off' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            colon={false}
            labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
            wrapperCol={{ md: 12 }}
            rules={[
              {
                required: true,
                message: 'Please input the email!',
                pattern: new RegExp(Patterns.email),
              },
            ]}>
            <Input type='email' autoComplete='off' />
          </Form.Item>

          <Form.Item
            label='Role'
            name='roleId'
            colon={false}
            labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
            wrapperCol={{ md: 12 }}
            rules={[
              {
                required: true,
                message: 'Please input the role!',
              },
            ]}>
            <Select style={{ width: '100%' }} placeholder='Please input the role'>
              {rolesOptions}
            </Select>
          </Form.Item>

          <Form.Item
            label='Group'
            name='groupIds'
            colon={false}
            labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
            wrapperCol={{ md: 12 }}
            rules={[
              {
                required: true,
                message: 'Please input the group!',
              },
            ]}>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Please input the group'
              maxTagCount='responsive'
              onChange={(selectValue: string[]) => {
                handleSelectGroup(selectValue)
              }}>
              {groupsOptions}
            </Select>
          </Form.Item>

          {error && <Alert message={error.message} type='error' />}
        </Form>
      </Modal>
      {/* END Add users modal */}

      {/* Remove user modal */}
      <Modal
        title='Delete user'
        visible={isDeleteUsersModalVisible}
        onCancel={handleDeleteUserCancel}
        width={656}
        wrapClassName='remove-user--modal'
        footer={[
          <Button
            key='submit'
            htmlType='submit'
            className='c-button--1'
            onClick={() => {
              deleteUser(userToDelete)
            }}>
            Yes, delete user
          </Button>,
        ]}>
        <Heading level='1' variant='3'>
          Are you sure?
        </Heading>
        <p>This action cannot be undone.</p>
      </Modal>
      {/* End Remove user modal */}

      <Table
        columns={columns}
        dataSource={users}
        pagination={false}
        sortDirections={['ascend', 'descend', 'ascend']}
        scroll={{ x: 360 }}></Table>
    </div>
  )
})
