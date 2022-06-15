import { Alert, Button, Checkbox, Form, FormInstance, Modal, Select, Slider } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { ErrorMesage } from 'models'
import { FC, useState } from 'react'

interface PlaybookModalProps {
  visible: boolean
  onCancel: () => void
  updateSettings: (form: FormInstance) => void
}
const mockIntegrations = [
  { id: 'marketo', name: 'Marketo' },
  { id: 'salesforce', name: 'Salesforce' },
  { id: 'pendo', name: 'Pendo' },
]
export const PlaybookModal: FC<PlaybookModalProps> = (props: PlaybookModalProps) => {
  const { visible, onCancel, updateSettings } = props

  const [error] = useState<ErrorMesage | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const { Option } = Select
  const [form] = Form.useForm()
  const integrationsOptions = mockIntegrations.map((integration) => (
    <Option key={integration.id} value={integration.id}>
      {integration.name}
    </Option>
  ))

  const handleDisabledChange = (e: CheckboxChangeEvent) => {
    setIsDisabled(!e.target.checked)
  }

  return (
    <Modal
      title='Define action'
      visible={visible}
      onCancel={onCancel}
      width={656}
      footer={[
        <Button
          key='submit'
          htmlType='submit'
          className='c-button--1'
          onClick={() => {
            updateSettings(form)
          }}>
          Update settings
        </Button>,
      ]}>
      <Form
        form={form}
        name='add_user_form'
        labelCol={{
          span: 10,
        }}
        autoComplete='off'
        initialValues={{
          application: mockIntegrations[0].name,
          letOptimize: ['optimize'],
          slider: 70,
        }}>
        <Form.Item
          label='Application'
          name='application'
          colon={false}
          labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
          wrapperCol={{ md: 12 }}
          rules={[
            {
              required: true,
              message: 'Please input the application',
            },
          ]}>
          <Select style={{ width: '100%' }} placeholder='Please input the application'>
            {integrationsOptions}
          </Select>
        </Form.Item>

        <Form.Item
          name='letOptimize'
          colon={false}
          labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
          wrapperCol={{ xs: { span: 20 }, md: { offset: 4 } }}
          style={{ marginBottom: 0 }}>
          <Checkbox.Group>
            <Checkbox onChange={handleDisabledChange} value='optimize'>
              {' '}
              Let Encore optimize
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name='slider'
          colon={false}
          labelCol={{ xs: { span: 6 }, md: { offset: 4 } }}
          wrapperCol={{ xs: { span: 20 }, md: { offset: 4 } }}>
          <Slider disabled={isDisabled} marks={{ 0: 'Limited', 100: 'Heavy' }} />
        </Form.Item>

        {error && <Alert message={error.message} type='error' />}
      </Form>
    </Modal>
  )
}
