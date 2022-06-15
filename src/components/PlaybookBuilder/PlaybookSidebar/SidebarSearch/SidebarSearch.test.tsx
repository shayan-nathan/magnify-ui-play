import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SidebarSearch } from './SidebarSearch'
import { IconSearch } from 'components/common/Icons/Icons'

const mockFunction = jest.fn()
// render as a asFragment, might be usefull with third-party components
const { asFragment } = render(<SidebarSearch onChangeState={mockFunction} prefix={<IconSearch />} />)
const searchComponent = screen.getByTestId('search')

describe('<SidebarSearch /> component', () => {
  it('renders correctly', () => {
    expect(asFragment()).toMatchSnapshot()
  })

  it('has the right placeholder and type', async () => {
    expect(searchComponent.getAttribute('placeholder')).toBe('search')
    expect(searchComponent.getAttribute('type')).toBe('text')
  })

  it('work typing', async () => {
    render(<SidebarSearch onChangeState={mockFunction} prefix={<IconSearch />} />)
    const searchComponent: HTMLInputElement = screen.getByTestId('search')

    // initially the field is empty
    expect(searchComponent).toHaveValue('')
    userEvent.type(searchComponent, 'Time delay')
    expect(searchComponent).toHaveValue('Time delay')
    expect(mockFunction.mock.calls.length).toBe(10)

    userEvent.clear(searchComponent)

    userEvent.type(searchComponent, 'Time{space}delay')
    expect(searchComponent).toHaveValue('Time delay')
  })
})
