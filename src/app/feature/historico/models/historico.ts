export interface ConsultHistorical {
  fromDate: string;
  toDate: string;
  users: string[];
  functionalities: string[];
}

export interface AuditDto {
  id: number;
  registerDate: Date;
  strRegisterDate: string;
  action: string;
  title: string;
  detail: string | null;
  user: string;
  functionality: string;
}
