export class CalcularCostosDto {
  salaryCosts: number = 0;
  elementsCosts: number = 0;
  totalCosts: number = 0;
  elementsTransversal: number = 0;
  costMonthlyService: number = 0;
  ivaCosts: number = 0;
  ivaPercentage: number = 0;
  serviceWithIVA: number = 0;
  applyMinimumTariff: boolean;
  applyObjectiveValue: boolean;
  monthlyTariff: number;
  objectiveValue: number;
  minimumTariffSV: number
  serviceTariff: number;
  typeIVA: string;
  taxesMarginDto: ImpuestosMargenesDto[] = [];
}

export class ImpuestosMargenesDto {
  cost: number;
  percentage: number;
  taxName: string;
}

export interface TarifaServiciosDto {
  id: number;
  name: string;
  percentage: number;
}

// export class ServicioIVADto {
//   ivaCosts: number = 0;
//   ivaPercentage: number = 0;
//   serviceWithIVA: number = 0;
// }
