export interface SubchargueElementType {
  elementTypeId: number;
  elementTypeName: string;
  elements: SubChargueElementProvider[];
}

export interface SubChargueElementProvider {
  unitPrice: number;
  lastUnitPrice?: number;
  currentPrice?: number;
  percentage: string;
  subChargeId: number;
  elementProviderId: number;
  elementName: string;
  elementCode: string;
}

export interface ElementProvider {
  id: number;
  supplierId: number;
  supplierName: string;
  elementTypeId: number;
  elementTypeName: string;
  elementId: number;
  elementName: string;
  unitPrice: number;
  updateDate: Date | null;
  lastUnitPrice: number | null;
  currentPrice: number | null;
  percentage: null | string;
  isActive: boolean;
  distributionType: string;
}
