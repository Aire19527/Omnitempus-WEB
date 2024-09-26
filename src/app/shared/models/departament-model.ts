export interface DepartamentModel {
  code: string;
  name: string;
}

export interface MunicipalityModel extends DepartamentModel {
  departmentCode: string;
  departmentName: string;
}
