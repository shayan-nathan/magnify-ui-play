export const initialState = {
  data: [
    {
      name: 'salesforce',
      entityType: 'platform',
    },
    {
      name: 'zendesk',
      entityType: 'platform',
    },
  ],
}

export const salesforceObjectsMetadata = {
  data: [
    {
      name: 'Account',
    },
    {
      name: 'Task',
    },
    {
      name: 'Opportunity',
    },
    {
      name: 'platform',
    },
    {
      name: 'tenantId',
    },
    {
      name: 'Contact',
    },
    {
      name: 'Case',
    },
  ],
}

export const stateWithSalesforceObjectsMetadata = {
  data: [
    {
      name: 'salesforce',
      entityType: 'platform',
      data: [
        {
          name: 'Account',
        },
        {
          name: 'Task',
        },
        {
          name: 'Opportunity',
        },
        {
          name: 'platform',
        },
        {
          name: 'tenantId',
        },
        {
          name: 'Contact',
        },
        {
          name: 'Case',
        },
      ],
    },
    {
      name: 'zendesk',
      entityType: 'platform',
    },
  ],
}

export const salesforceAccountMetadata = {
  data: [
    {
      name: 'ShippingLatitude',
      type: 'double',
    },
    {
      name: 'LastModifiedDate',
      type: 'datetime',
    },
    {
      name: 'BillingCity',
      type: 'string',
    },
    {
      name: 'JigsawCompanyId',
      type: 'string',
    },
    {
      name: 'SLA__c',
      type: 'picklist',
    },
    {
      name: 'NaicsCode',
      type: 'string',
    },
    {
      name: 'Name',
      type: 'string',
    },
    {
      name: 'Industry',
      type: 'picklist',
    },
    {
      name: 'OperatingHoursId',
      type: 'reference',
    },
    {
      name: 'CreatedById',
      type: 'reference',
    },
    {
      name: 'TickerSymbol',
      type: 'string',
    },
    {
      name: 'BillingGeocodeAccuracy',
      type: 'picklist',
    },
    {
      name: 'AccountSource',
      type: 'picklist',
    },
    {
      name: 'BillingPostalCode',
      type: 'string',
    },
    {
      name: 'DandbCompanyId',
      type: 'reference',
    },
    {
      name: 'PhotoUrl',
      type: 'url',
    },
    {
      name: 'MasterRecordId',
      type: 'reference',
    },
    {
      name: 'IsDeleted',
      type: 'boolean',
    },
    {
      name: 'LastViewedDate',
      type: 'datetime',
    },
    {
      name: 'ShippingGeocodeAccuracy',
      type: 'picklist',
    },
    {
      name: 'DunsNumber',
      type: 'string',
    },
    {
      name: 'Sic',
      type: 'string',
    },
    {
      name: 'ShippingStreet',
      type: 'textarea',
    },
    {
      name: 'CleanStatus',
      type: 'picklist',
    },
    {
      name: 'YearStarted',
      type: 'string',
    },
    {
      name: 'ShippingPostalCode',
      type: 'string',
    },
    {
      name: 'CreatedDate',
      type: 'datetime',
    },
    {
      name: 'CustomerPriority__c',
      type: 'picklist',
    },
    {
      name: 'ShippingState',
      type: 'string',
    },
    {
      name: 'SicDesc',
      type: 'string',
    },
    {
      name: 'Id',
      type: 'id',
    },
    {
      name: 'BillingState',
      type: 'string',
    },
    {
      name: 'AnnualRevenue',
      type: 'currency',
    },
    {
      name: 'Active__c',
      type: 'picklist',
    },
    {
      name: 'Jigsaw',
      type: 'string',
    },
    {
      name: 'Site',
      type: 'string',
    },
    {
      name: 'Ownership',
      type: 'picklist',
    },
    {
      name: 'Description',
      type: 'textarea',
    },
    {
      name: 'Rating',
      type: 'picklist',
    },
    {
      name: 'Website',
      type: 'url',
    },
    {
      name: 'LastReferencedDate',
      type: 'datetime',
    },
    {
      name: 'BillingLatitude',
      type: 'double',
    },
    {
      name: 'NumberOfEmployees',
      type: 'int',
    },
    {
      name: 'BillingAddress',
      type: 'address',
    },
    {
      name: 'SLASerialNumber__c',
      type: 'string',
    },
    {
      name: 'OwnerId',
      type: 'reference',
    },
    {
      name: 'BillingLongitude',
      type: 'double',
    },
    {
      name: 'Tradestyle',
      type: 'string',
    },
    {
      name: 'Phone',
      type: 'phone',
    },
    {
      name: 'UpsellOpportunity__c',
      type: 'picklist',
    },
    {
      name: 'NumberofLocations__c',
      type: 'double',
    },
    {
      name: 'ShippingCountry',
      type: 'string',
    },
    {
      name: 'ShippingCity',
      type: 'string',
    },
    {
      name: 'ParentId',
      type: 'reference',
    },
    {
      name: 'NaicsDesc',
      type: 'string',
    },
    {
      name: 'AccountNumber',
      type: 'string',
    },
    {
      name: 'SystemModstamp',
      type: 'datetime',
    },
    {
      name: 'Type',
      type: 'picklist',
    },
    {
      name: 'SLAExpirationDate__c',
      type: 'date',
    },
    {
      name: 'BillingCountry',
      type: 'string',
    },
    {
      name: 'BillingStreet',
      type: 'textarea',
    },
    {
      name: 'ShippingAddress',
      type: 'address',
    },
    {
      name: 'LastActivityDate',
      type: 'date',
    },
    {
      name: 'Fax',
      type: 'phone',
    },
    {
      name: 'LastModifiedById',
      type: 'reference',
    },
    {
      name: 'ShippingLongitude',
      type: 'double',
    },
  ],
}
export const stateWithSalesforceObjectsAccountMetadata = {
  data: [
    {
      name: 'salesforce',
      entityType: 'platform',
      data: [
        {
          name: 'Account',
          data: [
            {
              name: 'ShippingLatitude',
              type: 'double',
            },
            {
              name: 'LastModifiedDate',
              type: 'datetime',
            },
            {
              name: 'BillingCity',
              type: 'string',
            },
            {
              name: 'JigsawCompanyId',
              type: 'string',
            },
            {
              name: 'SLA__c',
              type: 'picklist',
            },
            {
              name: 'NaicsCode',
              type: 'string',
            },
            {
              name: 'Name',
              type: 'string',
            },
            {
              name: 'Industry',
              type: 'picklist',
            },
            {
              name: 'OperatingHoursId',
              type: 'reference',
            },
            {
              name: 'CreatedById',
              type: 'reference',
            },
            {
              name: 'TickerSymbol',
              type: 'string',
            },
            {
              name: 'BillingGeocodeAccuracy',
              type: 'picklist',
            },
            {
              name: 'AccountSource',
              type: 'picklist',
            },
            {
              name: 'BillingPostalCode',
              type: 'string',
            },
            {
              name: 'DandbCompanyId',
              type: 'reference',
            },
            {
              name: 'PhotoUrl',
              type: 'url',
            },
            {
              name: 'MasterRecordId',
              type: 'reference',
            },
            {
              name: 'IsDeleted',
              type: 'boolean',
            },
            {
              name: 'LastViewedDate',
              type: 'datetime',
            },
            {
              name: 'ShippingGeocodeAccuracy',
              type: 'picklist',
            },
            {
              name: 'DunsNumber',
              type: 'string',
            },
            {
              name: 'Sic',
              type: 'string',
            },
            {
              name: 'ShippingStreet',
              type: 'textarea',
            },
            {
              name: 'CleanStatus',
              type: 'picklist',
            },
            {
              name: 'YearStarted',
              type: 'string',
            },
            {
              name: 'ShippingPostalCode',
              type: 'string',
            },
            {
              name: 'CreatedDate',
              type: 'datetime',
            },
            {
              name: 'CustomerPriority__c',
              type: 'picklist',
            },
            {
              name: 'ShippingState',
              type: 'string',
            },
            {
              name: 'SicDesc',
              type: 'string',
            },
            {
              name: 'Id',
              type: 'id',
            },
            {
              name: 'BillingState',
              type: 'string',
            },
            {
              name: 'AnnualRevenue',
              type: 'currency',
            },
            {
              name: 'Active__c',
              type: 'picklist',
            },
            {
              name: 'Jigsaw',
              type: 'string',
            },
            {
              name: 'Site',
              type: 'string',
            },
            {
              name: 'Ownership',
              type: 'picklist',
            },
            {
              name: 'Description',
              type: 'textarea',
            },
            {
              name: 'Rating',
              type: 'picklist',
            },
            {
              name: 'Website',
              type: 'url',
            },
            {
              name: 'LastReferencedDate',
              type: 'datetime',
            },
            {
              name: 'BillingLatitude',
              type: 'double',
            },
            {
              name: 'NumberOfEmployees',
              type: 'int',
            },
            {
              name: 'BillingAddress',
              type: 'address',
            },
            {
              name: 'SLASerialNumber__c',
              type: 'string',
            },
            {
              name: 'OwnerId',
              type: 'reference',
            },
            {
              name: 'BillingLongitude',
              type: 'double',
            },
            {
              name: 'Tradestyle',
              type: 'string',
            },
            {
              name: 'Phone',
              type: 'phone',
            },
            {
              name: 'UpsellOpportunity__c',
              type: 'picklist',
            },
            {
              name: 'NumberofLocations__c',
              type: 'double',
            },
            {
              name: 'ShippingCountry',
              type: 'string',
            },
            {
              name: 'ShippingCity',
              type: 'string',
            },
            {
              name: 'ParentId',
              type: 'reference',
            },
            {
              name: 'NaicsDesc',
              type: 'string',
            },
            {
              name: 'AccountNumber',
              type: 'string',
            },
            {
              name: 'SystemModstamp',
              type: 'datetime',
            },
            {
              name: 'Type',
              type: 'picklist',
            },
            {
              name: 'SLAExpirationDate__c',
              type: 'date',
            },
            {
              name: 'BillingCountry',
              type: 'string',
            },
            {
              name: 'BillingStreet',
              type: 'textarea',
            },
            {
              name: 'ShippingAddress',
              type: 'address',
            },
            {
              name: 'LastActivityDate',
              type: 'date',
            },
            {
              name: 'Fax',
              type: 'phone',
            },
            {
              name: 'LastModifiedById',
              type: 'reference',
            },
            {
              name: 'ShippingLongitude',
              type: 'double',
            },
          ],
        },
        {
          name: 'Task',
        },
        {
          name: 'Opportunity',
        },
        {
          name: 'platform',
        },
        {
          name: 'tenantId',
        },
        {
          name: 'Contact',
        },
        {
          name: 'Case',
        },
      ],
    },
    {
      name: 'zendesk',
      entityType: 'platform',
    },
  ],
}

export const AccountSourceMetadata = {
  data: {
    dropdownValues: [
      {
        active: true,
        label: 'Web',
        validFor: null,
        value: 'Web',
        defaultValue: false,
      },
      {
        active: true,
        label: 'Phone Inquiry',
        validFor: null,
        value: 'Phone Inquiry',
        defaultValue: false,
      },
      {
        active: true,
        label: 'Partner Referral',
        validFor: null,
        value: 'Partner Referral',
        defaultValue: false,
      },
      {
        active: true,
        label: 'Purchased List',
        validFor: null,
        value: 'Purchased List',
        defaultValue: false,
      },
      {
        active: true,
        label: 'Other',
        validFor: null,
        value: 'Other',
        defaultValue: false,
      },
    ],
    type: 'picklist',
    required: true,
  },
}

export const stateWithSalesforceObjectsAccountMetadataAndAccountSourceMetadata = {
  data: [
    {
      name: 'salesforce',
      entityType: 'platform',
      data: [
        {
          name: 'Account',
          data: [
            {
              name: 'ShippingLatitude',
              type: 'double',
            },
            {
              name: 'LastModifiedDate',
              type: 'datetime',
            },
            {
              name: 'BillingCity',
              type: 'string',
            },
            {
              name: 'JigsawCompanyId',
              type: 'string',
            },
            {
              name: 'SLA__c',
              type: 'picklist',
            },
            {
              name: 'NaicsCode',
              type: 'string',
            },
            {
              name: 'Name',
              type: 'string',
            },
            {
              name: 'Industry',
              type: 'picklist',
            },
            {
              name: 'OperatingHoursId',
              type: 'reference',
            },
            {
              name: 'CreatedById',
              type: 'reference',
            },
            {
              name: 'TickerSymbol',
              type: 'string',
            },
            {
              name: 'BillingGeocodeAccuracy',
              type: 'picklist',
            },
            {
              name: 'AccountSource',
              type: 'picklist',
              data: {
                dropdownValues: [
                  {
                    active: true,
                    label: 'Web',
                    validFor: null,
                    value: 'Web',
                    defaultValue: false,
                  },
                  {
                    active: true,
                    label: 'Phone Inquiry',
                    validFor: null,
                    value: 'Phone Inquiry',
                    defaultValue: false,
                  },
                  {
                    active: true,
                    label: 'Partner Referral',
                    validFor: null,
                    value: 'Partner Referral',
                    defaultValue: false,
                  },
                  {
                    active: true,
                    label: 'Purchased List',
                    validFor: null,
                    value: 'Purchased List',
                    defaultValue: false,
                  },
                  {
                    active: true,
                    label: 'Other',
                    validFor: null,
                    value: 'Other',
                    defaultValue: false,
                  },
                ],
                type: 'picklist',
                required: true,
              },
            },
            {
              name: 'BillingPostalCode',
              type: 'string',
            },
            {
              name: 'DandbCompanyId',
              type: 'reference',
            },
            {
              name: 'PhotoUrl',
              type: 'url',
            },
            {
              name: 'MasterRecordId',
              type: 'reference',
            },
            {
              name: 'IsDeleted',
              type: 'boolean',
            },
            {
              name: 'LastViewedDate',
              type: 'datetime',
            },
            {
              name: 'ShippingGeocodeAccuracy',
              type: 'picklist',
            },
            {
              name: 'DunsNumber',
              type: 'string',
            },
            {
              name: 'Sic',
              type: 'string',
            },
            {
              name: 'ShippingStreet',
              type: 'textarea',
            },
            {
              name: 'CleanStatus',
              type: 'picklist',
            },
            {
              name: 'YearStarted',
              type: 'string',
            },
            {
              name: 'ShippingPostalCode',
              type: 'string',
            },
            {
              name: 'CreatedDate',
              type: 'datetime',
            },
            {
              name: 'CustomerPriority__c',
              type: 'picklist',
            },
            {
              name: 'ShippingState',
              type: 'string',
            },
            {
              name: 'SicDesc',
              type: 'string',
            },
            {
              name: 'Id',
              type: 'id',
            },
            {
              name: 'BillingState',
              type: 'string',
            },
            {
              name: 'AnnualRevenue',
              type: 'currency',
            },
            {
              name: 'Active__c',
              type: 'picklist',
            },
            {
              name: 'Jigsaw',
              type: 'string',
            },
            {
              name: 'Site',
              type: 'string',
            },
            {
              name: 'Ownership',
              type: 'picklist',
            },
            {
              name: 'Description',
              type: 'textarea',
            },
            {
              name: 'Rating',
              type: 'picklist',
            },
            {
              name: 'Website',
              type: 'url',
            },
            {
              name: 'LastReferencedDate',
              type: 'datetime',
            },
            {
              name: 'BillingLatitude',
              type: 'double',
            },
            {
              name: 'NumberOfEmployees',
              type: 'int',
            },
            {
              name: 'BillingAddress',
              type: 'address',
            },
            {
              name: 'SLASerialNumber__c',
              type: 'string',
            },
            {
              name: 'OwnerId',
              type: 'reference',
            },
            {
              name: 'BillingLongitude',
              type: 'double',
            },
            {
              name: 'Tradestyle',
              type: 'string',
            },
            {
              name: 'Phone',
              type: 'phone',
            },
            {
              name: 'UpsellOpportunity__c',
              type: 'picklist',
            },
            {
              name: 'NumberofLocations__c',
              type: 'double',
            },
            {
              name: 'ShippingCountry',
              type: 'string',
            },
            {
              name: 'ShippingCity',
              type: 'string',
            },
            {
              name: 'ParentId',
              type: 'reference',
            },
            {
              name: 'NaicsDesc',
              type: 'string',
            },
            {
              name: 'AccountNumber',
              type: 'string',
            },
            {
              name: 'SystemModstamp',
              type: 'datetime',
            },
            {
              name: 'Type',
              type: 'picklist',
            },
            {
              name: 'SLAExpirationDate__c',
              type: 'date',
            },
            {
              name: 'BillingCountry',
              type: 'string',
            },
            {
              name: 'BillingStreet',
              type: 'textarea',
            },
            {
              name: 'ShippingAddress',
              type: 'address',
            },
            {
              name: 'LastActivityDate',
              type: 'date',
            },
            {
              name: 'Fax',
              type: 'phone',
            },
            {
              name: 'LastModifiedById',
              type: 'reference',
            },
            {
              name: 'ShippingLongitude',
              type: 'double',
            },
          ],
        },
        {
          name: 'Task',
        },
        {
          name: 'Opportunity',
        },
        {
          name: 'platform',
        },
        {
          name: 'tenantId',
        },
        {
          name: 'Contact',
        },
        {
          name: 'Case',
        },
      ],
    },
    {
      name: 'zendesk',
      entityType: 'platform',
    },
  ],
}
