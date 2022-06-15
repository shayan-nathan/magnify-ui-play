import { Integration } from 'models/Integration.model'

function integrationSettings(integration: Integration | null) {
  let responseType: string, method: string, authorizeLink: string
  switch (integration?.id) {
    case 'salesforce':
      responseType = 'code'
      authorizeLink = 'https://login.salesforce.com/services/oauth2/authorize'
      break
    case 'intercom':
      method = 'get'
      authorizeLink = 'https://app.intercom.com/oauth'
      break
    default:
      authorizeLink = ''
      break
  }
  function getResponseType(): string {
    return responseType
  }
  function getMethod(): string {
    return method
  }
  function getAuthorizeLink(): string {
    return authorizeLink
  }
  return {
    getResponseType,
    getAuthorizeLink,
    getMethod,
  }
}
export default integrationSettings
