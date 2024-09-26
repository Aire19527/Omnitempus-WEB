export interface QuotationGetDto {
  id: number;
  requestNumber: string;
  offerCode: string;
  customersName: string;
  bussinesLineName: string;
  statusName: string;
  statusId: number;
}

export interface Cotizaciones {
  id: number;
  isFitLast: boolean;
  requestNumber: string;
  customersId: number;
  prospectusName: string;
  customersName: string;
  sundayPayment: number;
  bussinesLineId: number;
  contractDateStart: string;
  contractDateEnd: string;
  starServiceDate: string;
  pay31Day: boolean;
  law50: boolean;
  reinvestment: boolean;
  elementRequired: boolean;
  aditionalHoursMargin: number;
  commission: number;
  indirectCosts: number;
  gyaCosts: number;
  industryCommerce: number;
  observations: string;
  statusId: number;
  statusName: string;
  applicationRegistrationDate: string;
  offerCode: string;
  quotationPolicy: [
    {
      id: number;
      policyId: number;
      policyName: string;
      quotationsId: number;
      percentage: number;
    }
  ];
  elementsQuotations: [
    {
      id: number;
      quotationsId: number;
      elementId: number;
      elementName: string;
      value: number;
      depreciation: number;
      amount: number;
      box: number;
      boxCostMonth: number;
      transportCostDay: number;
      transportCostMonth: number;
    }
  ];
}

export interface Request {
  id: number;
  requestNumber: string;
  customerName: string;
}

export interface AddQuotationNoteDto {
  quoteTextId: number;
  quotationsId: number;
}
export interface QuotationNoteDto extends AddQuotationNoteDto {
  idQuotationNote: number;
  name: string;
  noteText: string;
}

export interface QuotationEconomicProposalDto {
  idQuotation: number;
  contactOT: string | null;
  position: string | null;
  implementationManager: string | null;
  approvalObservation: string | null;
  notes: string | null;
  attention: string | null;
  email: string | null;
}
