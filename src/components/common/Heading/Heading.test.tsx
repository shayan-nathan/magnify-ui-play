import { render, screen } from '@testing-library/react'

import { Heading } from 'components/common/Heading/Heading'

const component = (
  <Heading level='1' variant='1'>
    My Heading
  </Heading>
)
describe('<Heading />', () => {
  it('renderes with the correct content', () => {
    render(component)
    const element = screen.getByTestId('heading')

    expect(element).toMatchSnapshot()
    expect(element).toContainHTML('My Heading')
  })

  it('renders the right lvl of element', () => {
    render(component)
    const element = screen.getByTestId('heading')
    expect(element.tagName).toBe('H1')
  })

  it('renders the right lvl and variant', () => {
    render(
      <Heading level='2' variant='3'>
        My Heading
      </Heading>,
    )
    const h2Element = screen.getByTestId('heading')
    expect(h2Element.tagName).toBe('H2')
    expect(h2Element).toHaveClass('c-heading--3')
  })

  it('display a pharagraph if the lvl is too high', () => {
    render(
      <Heading level='6' variant='3'>
        My Heading
      </Heading>,
    )
    const h2Element = screen.getByTestId('heading')
    expect(h2Element.tagName).toBe('P')
    expect(h2Element).toHaveClass('c-heading--3')
  })
})
