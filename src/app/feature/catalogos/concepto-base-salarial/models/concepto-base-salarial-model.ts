export interface AddConceptoBaseSalarialModel {
  name: string;
  hasSeverancePay: boolean;
  hasBonus: boolean;
  hasVacation: boolean;
  hasEps: boolean;
  hasArl: boolean;
  hasRetirement: boolean;
  hasICBF: boolean;
  hasSena: boolean;
  hasExtraHours: boolean;
  applyAssistance: boolean,
  salaryConceptTypes: number,
  hasSeveranceInterest: boolean,
  hasLegalTransportSubsidy: boolean,
  hasCompensationBox: boolean
}
export interface ConceptoBaseSalarialModel
  extends AddConceptoBaseSalarialModel {
  id: number;
}
