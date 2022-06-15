import { Alert, Button, Dropdown, Form, Input, Menu, message, Modal, Row, Spin, Table } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import dayjs from 'dayjs'
import { useEffectOnce } from 'react-use'

import { useStore } from 'store'
import { Heading } from 'components/common'
import { ErrorMesage } from 'models'
import { Group } from 'models/users.model'
import { getMembers } from 'services/Utils/users.service'

interface GroupsProps {}

export const Groups: FC<GroupsProps> = observer(() => {
  const { userStore } = useStore()
  const { isLoading } = userStore
  const [isAddGroupModalVisible, setIsAddGroupModalVisible] = useState(false)
  const [isDeleteGroupModalVisible, setIsDeleteGroupModalVisible] = useState(false)
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false)
  const [group, setGroup] = useState<any>({ membersNo: 0, groupName: '', created_at: '', key: '' })
  const [error, setError] = useState<ErrorMesage | null>(null)
  const [form] = Form.useForm()

  const { getAll, getRoles, getGroups } = userStore

  useEffectOnce(() => {
    getRoles()
    getAll()
    getGroups()
  })

  const deleteGroup = async (group: any) => {
    if (group.key) {
      await userStore.removeGroup(group.key)
      handleDeleteGroupCancel()
      message.success('Group deleted successfully', 4)
    }
  }

  const deleteMenu = (group: Group) => (
    <Menu>
      <Menu.Item
        key='1'
        onClick={() => {
          showDeleteModal()
          setGroup(group)
        }}>
        Delete group
      </Menu.Item>
    </Menu>
  )
  const columns = [
    {
      title: 'Group name',
      dataIndex: 'groupName',
    },
    {
      title: 'Members',
      dataIndex: 'membersNo',
      render: (text: any, item: any) => {
        return (
          <Button
            onClick={() => {
              showMembersModal()
              setGroup(item)
            }}
            className='ant-btn-link'>
            {text}
          </Button>
        )
      },
    },
    {
      title: 'Date created',
      dataIndex: 'createdAt',
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
  const groups = userStore.groups.map((group) => {
    return {
      key: group.id,
      membersNo: getMembers(group.id, userStore.users, userStore.roles, userStore.groups).length,
      groupName: group.groupName,
      // TODO: Remove Hardcoded date
      createdAt: dayjs(group.createdAt).format('MMMM DD, YYYY'),
    }
  })

  const userColumns = [
    {
      title: 'username',
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
    },
  ]

  const addNewGroup = async () => {
    try {
      const values = await form.validateFields()
      const { groupName }: { groupName: string } = values
      const data = {
        groupName,
      }
      const newGroup = await userStore.postGroup(data)
      if (newGroup.id) {
        handleAddGroupCancel()
        message.success('Group added successfully', 4)
        return
      }
      message.error(newGroup.response.data.errorMessage, 4)
      setError(newGroup)
    } catch (error: any) {
      if (error.errorFields) {
        setError({ message: 'The form is invalid!', name: 'error', code: 'error' })
      } else {
        message.error('Add group failed!', 4)
        setError({ message: 'Add group failed!', name: error, code: 'error' })
      }
    }
  }

  const showAddModal = () => {
    setIsAddGroupModalVisible(true)
  }
  const handleAddGroupCancel = () => {
    form.resetFields()
    setIsAddGroupModalVisible(false)
    setError(null)
  }

  const showDeleteModal = () => {
    setIsDeleteGroupModalVisible(true)
  }
  const handleDeleteGroupCancel = () => {
    setIsDeleteGroupModalVisible(false)
  }

  const showMembersModal = () => {
    setIsMemberModalVisible(true)
  }
  const handleMembersGroupCancel = () => {
    setIsMemberModalVisible(false)
  }
  return (
    <div className='groups'>
      <Row align='middle' className='m-b-20'>
        <Heading level='3' variant='1'>
          Manage groups
        </Heading>
        <div className='c-button--right'>
          <Button key='submit' htmlType='submit' className='c-button--1' onClick={showAddModal}>
            + Add new group
          </Button>
        </div>
      </Row>
      <Spin size='large' spinning={isLoading}></Spin>

      {/* Add group modal */}
      <Modal
        title='Add new group'
        visible={isAddGroupModalVisible}
        onCancel={handleAddGroupCancel}
        width={656}
        wrapClassName='add-group--modal'
        footer={[
          <Button key='submit' htmlType='submit' className='c-button--1' onClick={addNewGroup}>
            Save
          </Button>,
        ]}>
        <Form
          form={form}
          name='add_group_form'
          labelCol={{
            span: 10,
          }}
          autoComplete='off'>
          <Form.Item
            label='Group name'
            name='groupName'
            colon={false}
            labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
            wrapperCol={{ md: 12 }}
            rules={[
              {
                required: true,
                message: 'Please input the group!',
              },
            ]}>
            <Input autoComplete='off' placeholder='Name your group' />
          </Form.Item>

          {error && <Alert message={error.message} type='error' />}
        </Form>
      </Modal>
      {/* END Add group modal */}

      {/* Remove group modal */}
      <Modal
        title='Delete group'
        visible={isDeleteGroupModalVisible}
        onCancel={handleDeleteGroupCancel}
        width={656}
        wrapClassName='remove-group--modal'
        footer={[
          <Button
            key='submit'
            htmlType='submit'
            className='c-button--1'
            onClick={() => {
              deleteGroup(group)
            }}>
            Yes, delete group
          </Button>,
        ]}>
        <Heading level='1' variant='3'>
          Are you sure?
        </Heading>
        <p>This action cannot be undone.</p>
      </Modal>
      {/* End Remove group modal */}

      {/* View members modal */}
      <Modal
        title={`${group.groupName} members`}
        visible={isMemberModalVisible}
        onCancel={handleMembersGroupCancel}
        width={656}
        wrapClassName='members--modal'
        footer={[
          <Button key='submit' htmlType='submit' className='c-button--1' onClick={handleMembersGroupCancel}>
            Close
          </Button>,
        ]}>
        <Table
          columns={userColumns}
          dataSource={getMembers(group.key, userStore.users, userStore.roles, userStore.groups)}
          pagination={false}
          sortDirections={['ascend', 'descend', 'ascend']}
          scroll={{ y: 360 }}></Table>
      </Modal>
      {/* END View members modal */}

      {/* groups table */}
      <Table
        columns={columns}
        dataSource={groups}
        pagination={false}
        sortDirections={['ascend', 'descend', 'ascend']}></Table>
      {/* END groups table */}
    </div>
  )
})
