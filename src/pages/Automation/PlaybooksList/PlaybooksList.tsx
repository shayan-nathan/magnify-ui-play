import { Button, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Playbook, PlaybookUpdate } from 'models/playbook.model'
import { useStore } from 'store'

interface PlaybooksListProps {}

export const PlaybooksList: FC<PlaybooksListProps> = observer(() => {
  const { playbookStore } = useStore()
  const { playbooks } = playbookStore

  const navigate = useNavigate()

  const redirectToCreatePlaybook = useCallback(
    (id, version) => navigate(`/journeys/playbook/${id}/${version}`),
    [navigate],
  )

  const updatePlaybook = (playbook: Playbook) => {
    redirectToCreatePlaybook(playbook.playbookId, playbook.version)
  }

  const onAction = async (playbook: Playbook, action: string) => {
    const { playbookId, version } = playbook
    const updateData: PlaybookUpdate = {
      playbookId,
      version,
    }

    try {
      const response = await playbookStore.update(updateData, action)
      console.log('response', response)
    } catch (error) {
      console.log('error', error)
    }
  }
  const onCloneAction = async (playbook: Playbook) => {
    const { playbookId, version } = playbook
    const cloneData: PlaybookUpdate = {
      playbookId,
      version,
    }

    try {
      const response = await playbookStore.clone(cloneData)
      console.log('response', response)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleExecute = async (playbook: Playbook) => {
    const { playbookId, version } = playbook
    const executeData: PlaybookUpdate = {
      playbookId,
      version,
    }

    try {
      await playbookStore.execute(executeData)
      message.success('EXECUTING', 4)
    } catch (error) {
      message.error('Execution faild', 4)
    }
  }
  const playbooksList = playbooks.data.map((playbook) => {
    const row = (
      <tr key={`${playbook.playbookId}-${playbook.version}`}>
        <td style={{ textAlign: 'left' }}>{playbook.title}</td>
        <td>{playbook.createdBy}</td>
        <td>{playbook.currState}</td>
        <td>
          <Button
            onClick={() => {
              onAction(playbook, 'publish')
            }}>
            Publish
          </Button>

          <Button
            onClick={() => {
              onCloneAction(playbook)
            }}>
            Clone
          </Button>

          <Button
            onClick={() => {
              handleExecute(playbook)
            }}>
            Execute
          </Button>

          <Button
            onClick={() => {
              onAction(playbook, 'archive')
            }}>
            Archive
          </Button>

          <Button
            onClick={() => {
              updatePlaybook(playbook)
            }}>
            View
          </Button>
        </td>
      </tr>
    )
    return row
  })
  useEffect(() => {
    playbookStore.getAll()
  }, [])

  return (
    <table style={{ width: '100%', textAlign: 'center' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Name</th>
          <th>author</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{playbooksList}</tbody>
    </table>
  )
})
