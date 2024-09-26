export interface ReporteModel {
  nameFile: string;
  idReport: number;
  parameters: any;
}

export interface ConsultReport extends ReporteModel {
  // idReport: number;
  // parameters: any;
  format: string;
}

export interface SalaryQuotation {}

export interface ElementQuotation {}

export interface TraceabilityQuotation {}
