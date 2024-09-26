export interface ElementByProvider {
  id: number;
  subChargesId: number;
  subChargesName: string;
  elementProviderId: number;
  quantity: number;
  elementTypeId: number;
  elementTypeName: string;
  elementId: number;
  elementName: string;
  distributionType: number;
  supplierName: string;
  supplierId: number;
  unitPrice: number;
  value: number;
  depreciation: number;
  amount: number;
  box: number;
  boxCostMonth: number;
  transportCostDay: number;
  transportCostMonth: number;
}

export interface AddSubChanger {
  name: string;
  description: string;
  positionId: number;
}

export interface Subchanger extends AddSubChanger {
  id: number;
}

export interface ConsultSubchanger extends Subchanger {
  position: string;
}

export interface AddElementQuotationDto {
  subchargeId: number;
  quotationId: number;
  municipalityCode: string;
  count: number;
}
