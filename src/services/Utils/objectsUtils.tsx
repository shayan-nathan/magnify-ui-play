// Rename the key of an object
export const renameKey = <OldKey extends keyof T, NewKey extends string, T extends Record<string, unknown>>(
  oldKey: OldKey,
  newKey: NewKey,
  userObject: T,
): Record<NewKey, T[OldKey]> & Omit<T, OldKey> => {
  const { [oldKey]: value, ...common } = userObject
  return {
    ...common,
    ...({ [newKey]: value } as Record<NewKey, T[OldKey]>),
  }
}
