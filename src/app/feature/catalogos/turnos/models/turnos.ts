export interface Turnos {
  id: 0;
  name: string;
  withFestive: boolean;
  withWeapon: boolean;
  description: string;
}

export interface AddShiftQuotatioDto {
  subChargesQuotationId: number;
  shiftId: number;
}
