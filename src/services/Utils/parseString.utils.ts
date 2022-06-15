/**
 * Function that gets a string and remove spaces,adds undescores and turn the whole string to lower case
 * @param    {value} string - The string that you want to transform
 * @return   {string}       - The transformed string
 */
export const getNormalize = (value: string): string => {
  return (
    value
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase() || ''
  )
}
/**
 * Function that gets a string and replace special caracters with underscores (_) turnin the whole string to lower case
 * @param    {value} string - The string that you want to transform
 * @return   {string}  - The transformed string
 */
export const sanitizeString = (value: string): string => {
  return value.replace(/[^A-Z0-9]+/gi, '_').toLowerCase() || ''
}
//
export const getOnlyLetters = (str: string) => {
  return str.replace(/[0-9]/g, '')
}

export const getOnlyNumbers = (str: string) => {
  return str.replace(/[^0-9]/g, '')
}

// converts to camelCase a string
export const toCamelCase = (str: string) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}
// converts to camelCase a string
export const camelCaseToNormalCase = (str: string) => {
  const splitByUppercase = str.replace(/([A-Z])/g, ' $1')
  const result = splitByUppercase.charAt(0).toUpperCase() + splitByUppercase.slice(1).toLowerCase()
  return result
}

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
