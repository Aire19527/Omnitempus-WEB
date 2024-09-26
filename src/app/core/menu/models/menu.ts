export interface MenuDto extends AreaMenu {
  isAssigned: boolean;
  idMenu: number;
}
export interface AreaMenu {
  name: string;
  url: string;
  icon: string;
  isPrincipal: boolean;
  subMenu: SubMenu[];
}

export interface SubMenu {
  idSubMenu: number;
  name: string;
  url: string;
  icon: string;
  isAssigned: boolean;
}

export interface ProfileType {
  displayName: string;
  mail: string;
  id: string;
}
