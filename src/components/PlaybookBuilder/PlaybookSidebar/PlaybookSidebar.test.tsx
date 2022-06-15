import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PlaybookSidebar } from './PlaybookSidebar'

describe('<PlaybookSidebar /> component', () => {
  it('renders correctly all the elements', async () => {
    render(<PlaybookSidebar platforms={[]} />)
    const playbookSidebar = await screen.findByTestId('playbook-sidebar')
    expect(playbookSidebar).toMatchSnapshot()

    const sidebarHeader = await screen.findByTestId('playbook-header')
    expect(sidebarHeader).toBeTruthy()

    const searchElement: HTMLInputElement = await screen.findByTestId('search')
    expect(searchElement).toBeTruthy()

    const actionMenuElement = await screen.findByTestId('action-menu')
    expect(actionMenuElement).toBeTruthy()

    const actionSources = await screen.findAllByTestId('action-source')
    expect(actionSources.length).toBe(11)
    expect(actionSources).toBeTruthy()

    const groupHeadigs = await screen.findAllByTestId('heading')
    expect(groupHeadigs).toBeTruthy()
    expect(groupHeadigs.length).toBe(3)
    expect(groupHeadigs[0].textContent).toBe('TARGETING')
    expect(groupHeadigs[1].textContent).toBe('RULES')
    expect(groupHeadigs[2].textContent).toBe('ACTIONS')
  })

  it('behaves correctly using the search field', async () => {
    render(<PlaybookSidebar platforms={[]} />)
    const searchElement: HTMLInputElement = await screen.findByTestId('search')
    expect(searchElement).toBeTruthy()
    // initially the field is empty
    expect(searchElement).toHaveValue('')
    const initialActionSources = await screen.findAllByTestId('action-source')
    expect(initialActionSources.length).toBe(11)
    // simulate the search for "time del"
    userEvent.type(searchElement, 'time del')
    expect(searchElement).toHaveValue('time del')

    const actionSources = await screen.findAllByTestId('action-source')
    expect(actionSources.length).toBe(1)
    expect(actionSources[0].textContent).toBe('Time delay')

    const submenuPlatforms = await screen.findAllByTestId('submenu-platform')
    expect(submenuPlatforms.length).toBe(2)
    expect(submenuPlatforms[0].textContent).toContain('Salesforce')

    // simulate clearing the whole input
    userEvent.clear(searchElement)
    expect(searchElement).toHaveValue('')
    const actionsAfterClearingTheSearch = await screen.findAllByTestId('action-source')
    expect(actionsAfterClearingTheSearch.length).toBe(11)
  })
})
