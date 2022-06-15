import { FC, useEffect } from 'react'
import { Button, Row, Skeleton } from 'antd'
import { observer } from 'mobx-react-lite'

import { SourceItem } from './SourceItem/SourceItem'
import { useStore } from 'store'

export const Sources: FC = observer(() => {
  const { integrationsStore } = useStore()
  const { getAll, isLoading } = integrationsStore

  const getAllSources = () => {
    getAll()
  }

  useEffect(() => {
    getAll()
  }, [])
  let connectedSources = integrationsStore.integrations.filter((integration) => integration.connections.length)
  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <ul className='c-source'>
          {connectedSources.map((source) => (
            <SourceItem source={source} key={source.id}></SourceItem>
          ))}
        </ul>
      )}
      <Row justify='end'>
        <Button type='link' onClick={getAllSources}>
          Refresh data
        </Button>
      </Row>
    </>
  )
})
