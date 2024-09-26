export interface Providers {
  id: number;
  name: string;
  nit: string;
  // isActive: boolean;
}


export interface ElementProvider {
  id: number,
  supplierId: number,
  supplierName: string,
  elementTypeId: number,
  elementTypeName: string,
  elementId: number,
  elementName: string,
  unitPrice: number,
  isActive: true,
  updateDate: Date
  lastUnitPrice: number,
  currentPrice: number,
  percentage: string,
}

export interface IncrementElements {
  elementProviderId: number,
  percentageIncrement: number
}