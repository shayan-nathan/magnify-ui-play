import { Alert, Button, Form, Input, Spin, message } from 'antd'
import { Auth } from 'aws-amplify'
import { FC, useState } from 'react'

import { Card, Heading } from 'components/common'
import { ErrorMesage } from 'models'

interface ChangePassProps {}

export const ChangePass: FC<ChangePassProps> = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorMesage | null>(null)

  async function changePassword(values: any) {
    const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = values

    try {
      setLoading(true)

      const user = await Auth.currentAuthenticatedUser()
      await Auth.changePassword(user, oldPassword, newPassword)
      setError(null)
      const successMessage = () => {
        message.success('Password changed successfully', 4)
      }

      successMessage()
      setLoading(false)
    } catch (error: any) {
      const errorMessage = () => {
        message.error(error.message, 4)
      }
      errorMessage()
      setError(error)

      setLoading(false)
    }
  }

  return (
    <div className='login c-sign-in' data-testid='sign-in'>
      <Card variant='2'>
        <Spin size='large' spinning={loading}>
          <Form layout='vertical' onFinish={changePassword} autoComplete='off'>
            <Heading level='3' variant='3'>
              Change Password
            </Heading>

            <Form.Item
              label='Old Password'
              name='oldPassword'
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder='Your password' type='password' autoComplete='current-password' />
            </Form.Item>

            <Form.Item
              label='New Password'
              name='newPassword'
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder='Your new password' />
            </Form.Item>

            {error && <Alert message={error.message} type='error' />}
            <Form.Item>
              <Button htmlType='submit' className='c-button--1'>
                Change password
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}
