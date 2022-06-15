import { MetadataStore } from './metadata.store'

import * as mock from '../mocks/metadata.mocks'
import { MetadataRoot } from 'models'

describe('Metadata store', () => {
  it('sets the initial state', () => {
    const store = new MetadataStore()
    store.setMetadata({ newMetadata: mock.initialState as MetadataRoot })
    expect(store.metadata).toEqual(mock.initialState)
  })

  it('sets the salesforce state', () => {
    const store = new MetadataStore()
    store.setMetadata({ newMetadata: mock.initialState as MetadataRoot })
    store.setMetadata({ newMetadata: mock.salesforceObjectsMetadata as MetadataRoot, platform: 'salesforce' })
    expect(store.metadata).toEqual(mock.stateWithSalesforceObjectsMetadata)
  })

  it('sets the salesforce Account fields simple', () => {
    const store = new MetadataStore()
    store.setMetadata({ newMetadata: mock.stateWithSalesforceObjectsMetadata as MetadataRoot })
    store.setMetadata({
      newMetadata: mock.salesforceAccountMetadata as MetadataRoot,
      platform: 'salesforce',
      object: 'Account',
    })
    expect(store.metadata).toEqual(mock.stateWithSalesforceObjectsAccountMetadata)
  })

  it('sets the salesforce Account fields including all the steps starting from initial', () => {
    const store = new MetadataStore()
    store.setMetadata({ newMetadata: mock.initialState as MetadataRoot })
    store.setMetadata({ newMetadata: mock.salesforceObjectsMetadata as MetadataRoot, platform: 'salesforce' })
    store.setMetadata({
      newMetadata: mock.salesforceAccountMetadata as MetadataRoot,
      platform: 'salesforce',
      object: 'Account',
    })
    expect(store.metadata).toEqual(mock.stateWithSalesforceObjectsAccountMetadata)
  })

  it('sets the salesforce, Account, AccountSource', () => {
    const store = new MetadataStore()
    store.setMetadata({ newMetadata: mock.stateWithSalesforceObjectsAccountMetadata as MetadataRoot })
    store.setMetadata({
      newMetadata: mock.AccountSourceMetadata as unknown as MetadataRoot,
      platform: 'salesforce',
      object: 'Account',
      field: 'AccountSource',
    })
    expect(store.metadata).toEqual(mock.stateWithSalesforceObjectsAccountMetadataAndAccountSourceMetadata)
  })
})
