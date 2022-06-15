import { FC } from 'react'
import classNames from 'classnames'

import { variant } from 'models'
interface CalloutProps {
  variant?: variant
  className?: string
  style?: any
  children?: JSX.Element | JSX.Element[] | string
}

export const Callout: FC<CalloutProps> = ({ variant, className, style, children }: CalloutProps) => {
  const calloutClass = classNames({
    'c-callout ': true,
    [`c-callout--${variant || '1'} ${className ? className : ''}`]: true,
  })

  return (
    <label className={calloutClass} style={style}>
      {children}
    </label>
  )
}
