import { makeAutoObservable, runInAction } from 'mobx'

import { API } from 'api/api'
import { MetadataDescription, MetadataRoot, MetadataTypes, SetMetadata, TransversMetadata } from 'models'

export class MetadataStore {
  currentItem: MetadataTypes = {}
  isLoading = true
  metadata: MetadataRoot = {
    data: [],
  }
  viewListMetadata: MetadataDescription[] = []
  constructor() {
    makeAutoObservable(this)
  }

  get = async (options?: MetadataTypes): Promise<void> => {
    this.isLoading = true
    const newMetadata = await API.metadata.get(options)
    runInAction(() => {
      this.setMetadata({ ...options, newMetadata })
      this.setViewListMetadata(newMetadata)
      this.isLoading = false
    })
    return newMetadata
  }

  setViewListMetadata = (values: MetadataRoot, withoutTypes?: boolean) => {
    if (withoutTypes) {
      this.viewListMetadata = values.data
      return
    }
    this.viewListMetadata = this.addObjectsEntityType(values)
  }

  setMetadata = (props: SetMetadata) => {
    const { newMetadata, platform, object, field } = props
    if (platform) {
      this.transverseMetadata({
        metadata: this.metadata,
        options: { platform, object, field },
        newMetadata,
        iterationNumber: 0,
      })
    }
    const metadataWithTypes = this.addObjectsEntityType(newMetadata)
    if (!platform) {
      this.metadata.data = metadataWithTypes
    }
    return this.metadata
  }

  addObjectsEntityType = (metadata: MetadataRoot, typeOfEntity?: string): MetadataDescription[] => {
    // platform/object/field
    if (!Array.isArray(metadata.data)) {
      return this.viewListMetadata
    }
    let entityType =
      this.currentItem.platform !== undefined ? 'object' : this.currentItem.object !== undefined ? 'field' : null
    if (typeOfEntity) {
      entityType = typeOfEntity
    }

    const metadataWithTypes = metadata?.data.map((metadataDescription: MetadataDescription) => {
      return { ...metadataDescription, entityType: entityType || 'platform' }
    })
    return metadataWithTypes
  }

  transverseMetadata = (data: TransversMetadata) => {
    const { metadata, options, newMetadata, iterationNumber, nextSearchItem } = data
    const itemToSearch = Object.values(options).filter((element) => element !== undefined)
    let currentIteration = iterationNumber
    const searchedName = nextSearchItem || itemToSearch[iterationNumber]
    const mustAddData = searchedName === itemToSearch[itemToSearch.length - 1]

    if (metadata?.data.length && searchedName) {
      for (let i = 0; i < metadata.data.length; i++) {
        if (metadata.data[i].name === searchedName && mustAddData) {
          metadata.data[i].data = newMetadata.data
          break
        }
        if (metadata.data[i].name === searchedName) {
          currentIteration++
          this.transverseMetadata({
            metadata: metadata.data[i],
            options,
            newMetadata,
            iterationNumber: currentIteration,
            nextSearchItem: itemToSearch[currentIteration],
          })
        }
      }
    }
  }

  isEmptyList = (array: []) => Array.isArray(array) && !array.length

  getKeyValue = <T extends object, U extends keyof T>(key: U, object: T) => object[key] !== undefined
  // usage
  //  getKeyValue <keyof Metadata, Metadata> ('data' ,metadata)

  getPlatforms = () => {
    this.get({})
    return
  }
  setCurrentItem = (item: MetadataDescription, forced?: boolean) => {
    if (forced) {
      this.currentItem = item as MetadataTypes
      return
    }
    const object: { [k: string]: string | undefined } = {}
    if (item.entityType !== undefined && item.type === undefined) {
      object[item.entityType] = item.name
    } else {
      object.field = item.name
    }

    this.currentItem = { ...this.currentItem, ...object }
  }

  getLoadedMetadata = (data: {
    metadata: MetadataRoot
    options: MetadataTypes | undefined
    iterationNumber: number
    nextSearchItem?: string
  }): MetadataDescription[] => {
    const { metadata, options, iterationNumber, nextSearchItem } = data
    if (!options) {
      return []
    }
    let existingMetadata: MetadataDescription[] = []

    const itemToSearch = Object.values(options).filter((element) => element !== undefined)

    let currentIteration = iterationNumber
    const searchedName = nextSearchItem || itemToSearch[iterationNumber]
    const mustAddData = searchedName === itemToSearch[itemToSearch.length - 1]

    if (metadata?.data.length && searchedName) {
      for (let i = 0; i < metadata.data.length; i++) {
        if (metadata.data[i].name === searchedName && mustAddData) {
          return (existingMetadata = metadata.data[i]?.data)
        }
        if (metadata.data[i].name === searchedName) {
          currentIteration++
          return this.getLoadedMetadata({
            metadata: metadata.data[i],
            options,
            iterationNumber: currentIteration,
            nextSearchItem: itemToSearch[currentIteration],
          })
        }
      }
    }
    return existingMetadata
  }
}
