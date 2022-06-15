import { FC } from 'react'
import dayjs from 'dayjs'

import { ReactComponent as IconConnected } from 'assets/images/check-mark.svg'
import { ReactComponent as IconNeedsAttention } from 'assets/images/red-info.svg'
import { Connection } from 'models/Integration.model'

interface ConnectedStatusProps {
  connections?: Connection[]
  status: string
  date?: number
}

export const ConnectedStatus: FC<ConnectedStatusProps> = (props: ConnectedStatusProps) => {
  const { connections, date, status } = props
  const connectedAt = date ? dayjs(date).format('MMM DD, YYYY') : null

  return (
    <div>
      {(connections && connections.length) || date ? (
        <div className='c-connected c-connected--status'>
          {!status.includes('Needs') ? <IconConnected /> : <IconNeedsAttention />}

          <span>
            {status} {date ? connectedAt : null}
          </span>
        </div>
      ) : (
        <div className='c-connected--status'>Not yet connected</div>
      )}
    </div>
  )
}
