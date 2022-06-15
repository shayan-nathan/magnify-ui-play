import classNames from 'classnames'
import { variant } from 'models'

interface Props {
  variant: variant
  className?: string
  style?: any
  children: JSX.Element | JSX.Element[] | string
}

export function Card({ variant, className, style, children }: Props): JSX.Element {
  return (
    <div className={classNames({ [`c-card c-card--${variant}`]: true, className })} style={style}>
      {children}
    </div>
  )
}
