import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Sources } from 'components/Sources/Sources'

export const SideNav: FC = observer(() => {
  return (
    <div className='sidenav'>
      <span className='sidenav__header'>Connected data sources</span>
      <div className='sidenav__content'>
        <Sources />
      </div>
    </div>
  )
})
