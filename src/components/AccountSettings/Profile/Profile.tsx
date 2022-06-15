import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Alert, Button, Form, Input, message, Modal, Spin } from 'antd'
import { Auth } from 'aws-amplify'
import { useEffectOnce } from 'react-use'

import { Heading } from 'components/common'
import { useStore } from 'store'
import { ErrorMesage } from 'models'
import { Role, RoleIds } from 'services/Utils/Role'

interface ProfileProps {}

export const Profile: FC<ProfileProps> = observer(() => {
  const { userStore } = useStore()
  const { get } = userStore
  const { username, isLoading, isLoadingGroups, email, role } = userStore
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [error, setError] = useState<ErrorMesage | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffectOnce(() => {
    if (userStore.role !== Role.SuperAdmin && userStore.username) {
      get(userStore.username)
    }
  })

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const [form] = Form.useForm()
  async function changePassword() {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = values
          setLoading(true)
          const user = await Auth.currentAuthenticatedUser()
          await Auth.changePassword(user, oldPassword, newPassword)
          setError(null)
          form.resetFields()
          const successMessage = () => {
            message.success('Password changed successfully', 4)
          }
          successMessage()
          setLoading(false)
          setIsModalVisible(false)
        } catch (error: any) {
          const errorMessage = () => {
            message.error(error.message, 4)
          }
          errorMessage()
          setError(error)

          setLoading(false)
        }
      })
      .catch((info: any) => {
        setError({ message: 'The form is invalid!', name: 'error', code: 'error' })
      })
  }

  return (
    <div className='profile'>
      <Heading level='3' variant='1'>
        Your profile
      </Heading>
      <Spin size='large' spinning={isLoading || isLoadingGroups || loading}>
        <ul className='profile-details'>
          <li>
            <span className='label'>Username</span>
            <p>{username}</p>
          </li>
          <li>
            <span className='label'>Email</span>
            <p>{email}</p>
          </li>
          <li>
            <span className='label'>Role</span>
            <p>{RoleIds[role]}</p>
          </li>
          <li>
            <span className='label'>Group</span>
            {userStore.userGroups &&
              userStore.userGroups.map((group) => (
                <p key={group.id} className='group--name'>
                  {group.groupName}
                </p>
              ))}
            {userStore.role === Role.SuperAdmin && <p>All groups</p>}
          </li>
          <li>
            <span className='label'>Password</span>
          </li>
          <li>
            <Button className='c-button--1' onClick={showModal}>
              Change password
            </Button>
          </li>
        </ul>
        <Modal
          title='Change password'
          visible={isModalVisible}
          onCancel={handleCancel}
          width={656}
          footer={[
            <Button key='submit' htmlType='submit' className='c-button--1' onClick={changePassword}>
              Save
            </Button>,
          ]}>
          <Form
            form={form}
            name='change_password_form'
            labelCol={{
              span: 10,
            }}
            autoComplete='off'>
            <Form.Item
              label='Current password'
              name='oldPassword'
              rules={[
                {
                  required: true,
                  message: 'Please input the current password!',
                },
              ]}
              colon={false}>
              <Input.Password autoComplete='off' />
            </Form.Item>

            <Form.Item
              label='New password'
              name='newPassword'
              colon={false}
              rules={[
                {
                  required: true,
                  message: 'Please input the new password!',
                },
              ]}>
              <Input.Password autoComplete='off' />
            </Form.Item>
            <Form.Item
              label='Confirm new password'
              name='confirmPassword'
              colon={false}
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                  },
                }),
              ]}>
              <Input.Password autoComplete='off' />
            </Form.Item>
            {error && <Alert message={error.message} type='error' />}
          </Form>
        </Modal>
      </Spin>
    </div>
  )
})
