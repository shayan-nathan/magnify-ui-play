import classNames from 'classnames'
import { variant } from 'models'

export type headingLvl = '1' | '2' | '3' | '4' | '5' | '6'

interface Props {
  level: headingLvl
  variant: variant
  className?: string
  children: JSX.Element | string
}

export function Heading({ level, variant, className, children }: Props): JSX.Element {
  const Element = level !== '6' ? (`h${level}` as keyof JSX.IntrinsicElements) : `p`

  return (
    <Element className={classNames({ [`c-heading c-heading--${variant} ${className}`]: true })} data-testid='heading'>
      {children}
    </Element>
  )
}
