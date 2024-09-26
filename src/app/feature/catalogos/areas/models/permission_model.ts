export interface PermissionModel {
  idPermission: number;
  permission: string;
  description: string;
  typePermission: string;
  isAssigned: boolean;
}

export interface PermissionInsertModel {
  idPermissions: number[];
  idArea: number;
}
