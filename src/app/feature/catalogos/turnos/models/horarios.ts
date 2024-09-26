import { EsquemaBase } from './esquemas';

export interface Horarios {
  id: number;
  shiftId: number;
  day: string;
  startHour: string;
  endHour: string;
}

export interface EsqeuemaHorarioPersona {
  person: string;
  schemePerson: {
    day: string;
    hour: number;
    abbreviation: string;
  }[];
}

export interface SchemesEditDto {
  scheme: EsquemaBase;
  generatedSchemas: EsqeuemaHorarioPersona[];
}
