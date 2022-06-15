import { render, screen } from '@testing-library/react'
import { Action } from 'components/PlaybookBuilder/PlaybookBuilderTypes'

import { ActionSource } from './ActionSource'

const mockProps: Action = {
  name: 'Segments',
  type: 'segment',
  shape: 'circle',
}

describe('<ActionSource /> component', () => {
  it('renders correctly', async () => {
    render(<ActionSource action={mockProps} />)
    const component = await screen.findByTestId('action-source')
    expect(component).toMatchSnapshot()
  })

  it('has an active button that is not draggable and the action box draggable', async () => {
    render(<ActionSource action={mockProps} />)
    const button = await screen.findByTestId('source-btn')
    // check button to not be disable
    expect(button).not.toBeDisabled()
    // check button to not be draggable
    expect(button).toHaveProperty('draggable', false)
    // check button to have the right style
    const sourceBoxElement = await screen.findByTestId('action-source')
    expect(sourceBoxElement).toHaveProperty('draggable', true)
  })

  it('has a button with the shape style class', async () => {
    render(<ActionSource action={mockProps} />)
    const button = await screen.findByTestId('source-btn')
    expect(button).toHaveClass(`c-targeting--${mockProps.shape}`)
  })

  it('display the name of the action', async () => {
    render(<ActionSource action={mockProps} />)
    const element = await screen.findByTestId('source-name')
    expect(element.textContent).toEqual(mockProps.name)
  })

  it('displaythe action image', async () => {
    render(<ActionSource action={mockProps} />)
    const image = await screen.findByTestId('source-image')
    expect(image).toHaveAttribute('src', 'segment.svg')
    expect(image).toHaveAttribute('alt', mockProps.name)
  })

  it('style the component based on type', async () => {
    render(<ActionSource action={mockProps} />)
    const image = await screen.findByTestId('source-image')
    expect(image).toHaveAttribute('src', 'segment.svg')
    expect(image).toHaveAttribute('alt', mockProps.name)
  })
})
