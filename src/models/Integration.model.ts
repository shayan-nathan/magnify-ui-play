export interface Integration {
  id: string
  name: string
  oauth: boolean
  userLogin: boolean
  connectionDate: number
  status: string
  connections: Connection[]
  sortOrder: number
  clientId: string
  redirectUri: string
}

export interface Connection {
  accessToken?: string
  app: string
  connectionDate: number
  id: string
  instanceUrl?: string
  name: string
  organizationId: string
  status: string
  url?: string
  email?: string
  userId?: string
  userName?: string
  password?: string
  securityToken?: string
  oauth: boolean
}
export interface ConnectionPost {
  oauth: boolean
  clientId?: string
  clientSecret?: string
  code?: string
  redirectUri?: string
  connectionName: string
  userName?: string
  password?: string
  securityToken?: string
  subDomain?: string
}
export interface ConnectionEdit {
  oauth?: boolean
  clientId?: string
  clientSecret?: string
  code?: string
  redirectUri?: string
  connectionName?: string
  userName?: string
  password?: string
  securityToken?: string
  subDomain?: string
}
export interface SalesforceOportunity {
  Amount: string
  CloseDate: string
  CreatedDate: string
  Id: string
  LastModifiedDate: string
  Name: string
  StageName: string
  SystemModstamp: string
}

interface Campaign {
  id: number
  name: string
}

interface Leads extends Campaign {}
export interface MarketoAction {
  campaigns: Campaign[]
  leads: Leads[]
}

export interface ActionPost {
  type?: string
  operation: string
  churn_probability: string
  opportunityId?: string
  connectionId: string
  MarketoCampaignId?: string
  MarketoLeadId?: string
}

export interface TrayAuthentications extends UserAccessToken {
  authOnlyDialogUrl: string
  error: any
}

export interface TrayAuthData extends UserAccessToken {
  platform: string
  authenticationId: string
  connectionName: string
}

interface UserAccessToken {
  userAccessToken: string
}
