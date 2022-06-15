import { Button, Col, Form, Input, Layout, message, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { Params, useParams } from 'react-router-dom'
import { Elements } from 'react-flow-renderer'

import { useStore } from 'store'
import { IconClose, IconPen } from 'components/common/Icons/Icons'
import { PlaybookTarget } from 'components/PlaybookTarget/PlaybookTarget'
import { PlaybookSidebar } from 'components/PlaybookBuilder/PlaybookSidebar/PlaybookSidebar'
import { Callout } from 'components/common'
import { dlsToReactFlow, reactFlowToDLS } from 'services/Utils/dslConversion'

interface PlaybookPageProps {}

export const PlaybookPage: FC<PlaybookPageProps> = observer(() => {
  const { integrationsStore, playbookStore } = useStore()
  const { currentPlaybook, initCurrentPlaybook } = playbookStore

  const { id, version }: Readonly<Params<string>> = useParams()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [playbookName, setPlaybookName] = useState<string>(currentPlaybook?.title || '')

  const [playbookGoal] = useState<string>('goal')
  const [segmentBuilderData, setSegmentBuilderData] = useState({})
  const [visible, setVisible] = useState(false)

  const onShowDrawer = (data: any) => {
    setSegmentBuilderData(data)
    setVisible(true)
  }

  const [elements, setElements] = useState<Elements>([])

  const onSaveData = async () => {
    const playbook = {
      ...currentPlaybook,
      title: playbookName,
      goal: playbookGoal,
      dsl: reactFlowToDLS(elements),
      integration: ['salesforce'],
      numSteps: 0,
    }
    console.log('save playbook', playbook)
    try {
      if (!id) {
        const response = await playbookStore.post(playbook)
        console.log('response', response)
        message.success('Playbook added', 4)
      } else {
        const response = await playbookStore.update({ ...playbook, title: playbookName })
        console.log('response', response)
        message.success('Playbook updated', 4)
      }
    } catch (error: any) {
      message.error('Playbook error', 4)
    }
  }

  console.log('elements', elements)
  const { getAll } = integrationsStore
  useEffect(() => {
    if (currentPlaybook?.dsl) {
      const reactFlowStructure = dlsToReactFlow(currentPlaybook.dsl)
      reactFlowStructure.map((el) => {
        const element = { ...el }
        element.data.onShowDrawer = onShowDrawer
        element.data.setElements = setElements
        element.data.description = element.data.description || element.data.name
        return element
      })
      setElements(reactFlowStructure)
    }
  }, [currentPlaybook])

  useEffectOnce(() => {
    getAll()
    if (id && version) {
      playbookStore.get({ playbookId: id, version: Number(version) })
    }
  })

  let connectedSources = integrationsStore.integrations.filter((integration) => integration.connections.length)

  const editHandler = () => {
    setIsEditing(true)
  }
  const changePlaybookName = (values: any) => {
    const { playbookName } = values
    setIsEditing(false)
    setPlaybookName(playbookName)
  }
  useEffect(() => {
    setPlaybookName(currentPlaybook?.title || '')
  }, [currentPlaybook?.title])

  useEffect(() => {
    if (!id) {
      initCurrentPlaybook()
    }
  }, [id])
  return (
    <Layout className='ant-layout-has-sider playbook-builder'>
      <PlaybookSidebar platforms={connectedSources}></PlaybookSidebar>
      <Layout className='content canvas-builder'>
        <Content>
          <Row className='playbook-top'>
            <Col md={14}>
              {isEditing && (
                <Form
                  name='change_name_form'
                  labelCol={{
                    span: 10,
                  }}
                  autoComplete='off'
                  onFinish={changePlaybookName}
                  style={{ display: 'flex' }}
                  initialValues={{
                    playbookName: playbookName,
                  }}>
                  <Form.Item
                    name='playbookName'
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: 'Please input the new name',
                      },
                    ]}>
                    <Input />
                  </Form.Item>

                  <Button htmlType='submit' className='c-button--1'>
                    Change name
                  </Button>
                </Form>
              )}
            </Col>
            {!isEditing && (
              <Col md={14}>
                <Row>
                  <span className='playbook-name'>{playbookName}</span>
                  <img src={IconPen} alt='Edit' className='m-l-15 m-r-15' onClick={editHandler} />
                  <Callout variant='2'>Draft</Callout>
                </Row>
              </Col>
            )}
            <Col md={10}>
              <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* <Button
                  className='c-button--2'
                  onClick={() => {
                    alert('Run simulation')
                  }}>
                  Run simulation
                </Button> */}
                <Button className='c-button--2' onClick={onSaveData}>
                  Save playbook
                </Button>
                <IconClose
                  className='c-close m-l-10'
                  onClick={() => {
                    console.log('elements', JSON.stringify(elements))
                  }}
                />
              </Row>
            </Col>
          </Row>
          {
            <PlaybookTarget
              playbook={{
                name: playbookName,
                goal: playbookGoal,
                elements: elements,
                visible: visible,
                segmentBuilderData: segmentBuilderData,
                setVisible: setVisible,
                setElements: setElements,
                onShowDrawer: onShowDrawer,
              }}
            />
          }
        </Content>
      </Layout>
    </Layout>
  )
})
