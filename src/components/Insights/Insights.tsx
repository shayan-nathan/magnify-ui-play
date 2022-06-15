import { FC, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Col, Row, Skeleton } from 'antd'
import { CloseOutlined, DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { Insight } from 'models/insights'
import { useStore } from 'store'
import { Callout, Card, Heading } from 'components/common'
/* EN-488 */
// import { InsightSources } from './InsightSources/InsightSources'
import { DateService } from 'services/Utils/date'

export const Insights: FC = observer(() => {
  const { insightsStore } = useStore()
  /* EN-477 */
  // const { getAll, isLoading } = insightsStore
  const { isLoading } = insightsStore
  const navigate = useNavigate()

  useEffect(() => {
    /* EN-477 */
    // getAll()
  }, [])
  const redirectToCreatePlaybook = useCallback((id) => navigate(`/journeys/playbook/new`), [navigate])

  const createPlaybook = (el: Insight) => {
    redirectToCreatePlaybook(el.id)
  }

  const insightsEl = insightsStore.insights.map((el, index) => {
    return (
      <Card variant='1' key={el.title}>
        <Row gutter={[16, 16]}>
          <Col md={24} lg={17}>
            {index === 0 ? (
              <Callout variant='1'>New</Callout>
            ) : (
              <span className='c-duration'>{DateService.timeSince(el.start_date)} </span>
            )}

            <h5 className='c-subheading--1'>{el.title}</h5>
            <p className='c-body--1'>{el.description}</p>
          </Col>
          <Col md={24} lg={6} className='c-right-side'>
            <Button
              className='c-button--1'
              onClick={() => {
                createPlaybook(el)
              }}>
              {/* Create playbook */}
              {/* EN-477 */}
              Create customer journey
            </Button>
            {/* EN-488 */}
            {/* <InsightSources sources={el.sources} /> */}
          </Col>
          <CloseOutlined className='c-close--icon' />
        </Row>
      </Card>
    )
  })

  return (
    <>
      <Heading level='1' variant='1'>
        Insights
      </Heading>
      {isLoading ? <Skeleton></Skeleton> : insightsEl}
      <Row className='c-flex__center'>
        <Button type='link'>
          View more <DownOutlined className='c-gray--2' />
        </Button>
      </Row>
    </>
  )
})
