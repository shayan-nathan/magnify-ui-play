import { message, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useStore } from 'store'

interface TrayAuthenticationProps {}

export const TrayAuthentication: React.FC<TrayAuthenticationProps> = observer(() => {
  const { integrationsStore } = useStore()
  const { trayAuthUrl, saveAuthentication, setLoading } = integrationsStore
  const { id }: any = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!trayAuthUrl) {
      integrationsStore.getTrayAuthUrl(id)
    }
  }, [trayAuthUrl])

  const backToPlatform = useCallback(() => {
    if (!integrationsStore.isLoading) {
      return navigate(`/integrations/${id}`)
    }
  }, [navigate])

  const handleIframeEvents = async (e: MessageEvent) => {
    console.log('e.data', e.data)
    switch (e.data.type) {
      case 'tray.authpopup.close':
        backToPlatform()
        break

      case 'tray.authpopup.error':
        message.error(`Error: ${e.data.err}`, 4)
        break

      case 'tray.authpopup.finish':
        const authenticationId = e.data.authId
        const authetication = {
          platform: id,
          authenticationId,
          connectionName: 'Hardcoded name',
          userAccessToken: integrationsStore.trayUserAccessToken,
        }
        setLoading(true)
        await saveAuthentication(authetication)
        message.success('Connection added!', 4)
        backToPlatform()
        break

      default:
        break
    }
  }
  useEffect(() => {
    window.addEventListener('message', handleIframeEvents)

    return () => {
      window.removeEventListener('message', handleIframeEvents)
    }
  }, [])

  return (
    <div className='tray-container'>
      <Spin size='large' spinning={!integrationsStore.trayAuthUrl}>
        <iframe className='tray-iframe' src={integrationsStore.trayAuthUrl} title='Authentication window' />
      </Spin>
    </div>
  )
})
