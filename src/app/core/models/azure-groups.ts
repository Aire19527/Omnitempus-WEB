export interface AzuremMyGroups {
  '@odata.context': string;
  value: AzureValueGroup[];
}

export interface AzureValueGroup {
  id: string;
  deletedDateTime: null;
  classification: null;
  createdDateTime: null;
}
