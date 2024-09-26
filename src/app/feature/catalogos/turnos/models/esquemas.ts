export interface EsquemaBase {
  id: number;
  shiftId: number;
  hoursForDay: number;
  daysForWeek: number;
  hoursForWeek: number;
  hoursDaysForPerson: number;
  daysWeekForPerson: number;
  hoursWeekForPerson: number;
  personRequired: number;
}
export interface Esquema extends EsquemaBase {
  shift: number;
  schemesPerson: string;
  createdAt: string;
  createdBy: string;
  lastModifiedByAt: string;
  lastModifiedBy: string;
  deletedByAt: string;
  deletedBy: string;
  newValues: string;
  oldValues: string;
  isActive: boolean;
}

export interface HorarioPersona {
  id: number;
  schemesPersonId: number;
  day: string;
  startHour: string;
  endHour: string;
  holidays: boolean;
  extraHours: boolean;
  startHourExtra: number;
}

export interface TimeSlot {
  day: string;
  startHour: string;
  endHour: string;
}
