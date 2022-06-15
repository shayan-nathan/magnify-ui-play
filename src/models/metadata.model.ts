export interface MetadataDescription extends MetadataRoot {
  name: string
  entityType?: string
  type?: string
}
export interface MetadataRoot {
  data: MetadataDescription[]
  name?: string
  // any is set for field values eg dropdownValues of AccountSource. I don't think we need that
}

export interface SetMetadata extends MetadataTypes {
  newMetadata: MetadataRoot
}

export interface MetadataTypes {
  platform?: string
  object?: string
  field?: string
}
export interface TransversMetadata {
  metadata: MetadataRoot
  options: MetadataTypes
  newMetadata: MetadataRoot
  iterationNumber: number
  nextSearchItem?: string
}
