export interface SalaryType {
    name: string,
    hasSeverancePay: boolean,
    hasSeveranceInterest: boolean,
    hasLegalTransportSubsidy: boolean,
    hasBonus: boolean,
    hasVacation: boolean,
    hasEps: boolean,
    hasArl: boolean,
    hasRetirement: boolean,
    hasICBF: boolean,
    hasSena: boolean,
    hasExtraHours: boolean,
    hasCompensationBox: boolean,
    applyAssistance: boolean
}

export interface AddSalaryType
  extends SalaryType {
  id: number;
}
