export interface AddBonoOT {
  subChargesQuotationId: number;
  generalParametersId: number;
  cost: number;
  depreciation: number;
  quantity: number;
}
export interface UpdateBonoOT extends AddBonoOT {
  id: number;
}
export interface BonosOT extends UpdateBonoOT {
  generalParameterName: string;
}
