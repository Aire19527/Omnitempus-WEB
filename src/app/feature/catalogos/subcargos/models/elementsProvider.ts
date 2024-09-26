import { BonosOT } from 'src/app/feature/cotizaciones/models/bonos-ot';
import { CalcularCostosDto } from 'src/app/feature/cotizaciones/models/costos-cotizacion';

export interface AddElementProviderDto {
  subChargesQuotationId: number;
  elementProviderId: number;
  cost: number;
  depreciation: number;
  quantity: number;
  box?: number;
  boxCostPerMonth?: number;
  transportationCostDay?: number;
  transportationCostMonth?: number;
}
export interface ElementProviderDto extends AddElementProviderDto {
  id: number;
  element: string;
  supplier: string;
}
export interface SalaryBaseConceptsQuotationDto {
  id: number;
  concept: string;
  value: number;
  subChargesQuotationId: number;
  salaryBaseConceptId: number;
}

export interface UpdateRiskARLQuotationDto {
  id: number;
  percentage: number;
  riskARLId: number;
}
export interface RiskARLQuotationDto extends UpdateRiskARLQuotationDto {
  quotationsId: number;
  subchargeId: number;
  concept: string;
  value?: number;
}

export interface ShiftQuotationGetDto {
  id: number;
  shiftId: number;
  shiftName: string;
  shiftDetails: ShiftDetailDto[];
}

export interface ShiftDetailDto {
  id: number;
  shiftId: number;
  day: string;
  startHour: string;
  endHour: string;
}

export interface ExtraHoursDto {
  concept: string;
  surcharge: number;
  numberHours: number;
  value: number;
}

export interface SubChargesQuotationDto {
  infoTraining: InfoTrainingDto;
  infoTest: InfoTestDto;
  infoCostHiring: InfoCostHiringDto;
  infoUniform: InfoUniformDto;
  infoResourcesPosition: InfoResourcesPositionDto;
  infoElementsCommunication: InfoElementsCommunicationDto;
  infoWeapon: InfoWeaponDto;
  infoElementsWeapon: InfoElementsWeaponDto;
  infoVehicle: InfoVehicleDto;
  infoElementsVehicle: InfoElementsVehicleDto;
  infoElementsOther: InfoElementsOtherDto;
  bonusOTs: BonosOT[];
  salarys: SalaryBaseConceptsQuotationDto[];
  riskARLQuotations: RiskARLQuotationDto[];
  shiftQuotations: ShiftQuotationGetDto[];
  extraHours: ExtraHoursDto[];
  idSubChargesQuotation: number;
  costsCalculated: CalcularCostosDto;
}

export interface BaseInfoDto {
  idElementType: number;
  singularNameElementType: string;
  pluralNameElementType: string;
}
export interface InfoTrainingDto extends BaseInfoDto {
  trainings: ElementProviderDto[];
}
export interface InfoTestDto extends BaseInfoDto {
  tests: ElementProviderDto[];
}
export interface InfoCostHiringDto extends BaseInfoDto {
  costHirings: ElementProviderDto[];
}
export interface InfoUniformDto extends BaseInfoDto {
  uniforms: ElementProviderDto[];
}
export interface InfoResourcesPositionDto extends BaseInfoDto {
  resourcesPositions: ElementProviderDto[];
}
export interface InfoElementsCommunicationDto extends BaseInfoDto {
  elementsCommunications: ElementProviderDto[];
}
export interface InfoWeaponDto extends BaseInfoDto {
  weapons: ElementProviderDto[];
}
export interface InfoElementsWeaponDto extends BaseInfoDto {
  weaponElements: ElementProviderDto[];
}

export interface InfoVehicleDto extends BaseInfoDto {
  vehicles: ElementProviderDto[];
}
export interface InfoElementsVehicleDto extends BaseInfoDto {
  vehicleElements: ElementProviderDto[];
}
export interface InfoElementsOtherDto extends BaseInfoDto {
  otherElements: ElementProviderDto[];
}
