export interface AddCargoModel {
  name: string;
  baseSalary: number;
  comprehensiveSalary: boolean;
  riskARLId: number;
  description: string;
  trainingHours: number;
}

export interface Cargo extends AddCargoModel {
  id: number;
}

export interface ConsultPosition extends Cargo {
  strComprehensiveSalary: string;
  strPercentageRiskARL: string;
  fullRiskARL: string;
}
