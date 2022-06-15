import { useState } from 'react'
import { Auth } from 'aws-amplify'
import { Form, Input, Button, Spin, Alert } from 'antd'
import { Link } from 'react-router-dom'

import { Card, Heading } from 'components/common'
// import { ReactComponent as IconEncoreLogo } from 'assets/images/logo-blue.svg'
import { ErrorMesage } from 'models'

export function SignIn(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorMesage | null>(null)
  const [showNewPasswordField, setShowNewPasswordField] = useState<boolean>(false)

  async function onFinish(values: any) {
    const { email, password, newpassword }: { email: string; password: string; newpassword: string } = values
    try {
      setLoading(true)
      const user = await Auth.signIn(email, password)
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setLoading(false)
        setShowNewPasswordField(true)
        setError(null)
      }

      if (newpassword) {
        setLoading(true)
        await Auth.completeNewPassword(user, newpassword)
      }
    } catch (error: any) {
      setLoading(false)
      setError(error)
    }
  }

  return (
    <div className='login c-sign-in' data-testid='sign-in'>
      {/* TODO replace this component with the magnify logo */}
      {/* <IconEncoreLogo className='login__logo' /> */}
      <h2 className='logo-text'>Magnify</h2>
      <Card variant='2'>
        <Spin size='large' spinning={loading}>
          <Form layout='vertical' onFinish={onFinish}>
            <Heading level='3' variant='3'>
              Access your account
            </Heading>

            <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input placeholder='Your email address' type='email' autoComplete='username' />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder='Your password' type='password' autoComplete='current-password' />
            </Form.Item>

            {showNewPasswordField && (
              <Form.Item
                label='New Password'
                name='newpassword'
                validateStatus={showNewPasswordField ? 'warning' : ''}
                help='Please enter your new password'>
                <Input.Password placeholder='Strong password' />
              </Form.Item>
            )}

            {error && <Alert message={error.message} type='error' />}

            <Button htmlType='submit' className='c-button--1'>
              Sign in
            </Button>

            <p className='c-sign-in__reset'>
              Don't remember your password? <Link to='/reset'>Reset password</Link>
            </p>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}
