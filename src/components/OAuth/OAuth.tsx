import { Button } from 'antd'
import classNames from 'classnames'
import { FC } from 'react'

import { variant } from 'models'

interface OAuthProps {
  redirectUri: string | undefined
  authorizeLink: string
  clientId: string | undefined
  method?: string
  scope?: string
  responseType?: string
  variant?: variant
  className?: string
  title?: string
}

export const OAuth: FC<OAuthProps> = (props: OAuthProps) => {
  const {
    authorizeLink,
    clientId,
    method = 'post',
    scope,
    responseType,
    variant = 2,
    className,
    title = ' Connect by Oauth',
  } = props
  let { redirectUri } = props

  if (process.env.REACT_APP_ENV === 'local') {
    redirectUri = redirectUri?.replace('https', 'http').replace('dash.dev.postsalez.com', 'localhost:3000')
  }

  return (
    <form action={authorizeLink} method={method} className='c-oauth-form'>
      <input type='hidden' defaultValue={redirectUri} name='redirect_uri' />
      <input type='hidden' defaultValue={clientId} name='client_id' />
      {scope && <input type='hidden' defaultValue={scope} name='scope' />}
      {responseType && <input type='hidden' defaultValue={responseType} name='response_type' />}
      <Button
        htmlType='submit'
        className={classNames({ [`c-button--${variant} ${className ? className : ''}`]: true })}>
        {title}
      </Button>
    </form>
  )
}
