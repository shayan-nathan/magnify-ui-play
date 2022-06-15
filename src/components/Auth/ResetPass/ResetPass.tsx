import { useState } from 'react'
import { Auth } from 'aws-amplify'
import { Form, Input, Button, Spin, Alert } from 'antd'
import { Link } from 'react-router-dom'

import { Card, Heading } from 'components/common'
// import { ReactComponent as IconEncoreLogo } from 'assets/images/logo-blue.svg'
import { ErrorMesage } from 'models'

export function ResetPass(): JSX.Element {
  const [codeWasSent, setCodeWasSent] = useState<boolean>(false)
  const [newPassordWasSet, setNewPassordWasSet] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorMesage | null>(null)

  async function resetPassword(values: any) {
    const { email, code, newPassword }: { email: string; code: string; newPassword: string } = values

    if (codeWasSent) {
      try {
        setLoading(true)

        const response = await Auth.forgotPasswordSubmit(email, code, newPassword)

        if (response === 'SUCCESS') {
          setError(null)
          setCodeWasSent(false)
          setNewPassordWasSet(true)
        }

        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        setError(error)
      }
    } else {
      try {
        setLoading(true)
        await Auth.forgotPassword(email)

        setError(null)
        setCodeWasSent(true)
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        setError(error)
      }
    }
  }

  return (
    <div className='login c-reset-pass' data-testid='reset-pass'>
      {/* TODO replace this component with the magnify logo */}
      {/* <IconEncoreLogo className='login__logo' /> */}
      <h2 className='logo-text'>Magnify</h2>
      <Card variant='2'>
        <Spin size='large' spinning={loading}>
          <Form layout='vertical' onFinish={resetPassword}>
            <Heading level='3' variant='3'>
              Forgot password
            </Heading>

            <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input placeholder='Your email address' type='email' autoComplete='username' />
            </Form.Item>

            {codeWasSent && (
              <Form.Item
                label='Password reset code'
                name='code'
                rules={[{ required: true, message: 'Please input the reset code!' }]}>
                <Input placeholder='Enter the code we sent you by email' />
              </Form.Item>
            )}

            {codeWasSent && (
              <Form.Item
                label='New password'
                name='newPassword'
                rules={[{ required: true, message: 'Please input your new password!' }]}>
                <Input.Password placeholder='Your new password' />
              </Form.Item>
            )}
            {error && <Alert message={error.message} type='error' />}
            {newPassordWasSet && <Alert message='Password Reset successful!' type='success' />}
            {codeWasSent && <Alert message='We have e-mailed your password reset code!' type='success' />}
            {!newPassordWasSet && (
              <Button htmlType='submit' className='c-button--1'>
                Reset Password
              </Button>
            )}

            <p className='c-reset-pass__sign-in'>
              <Link to='/signin'>Sign in</Link>
            </p>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}
