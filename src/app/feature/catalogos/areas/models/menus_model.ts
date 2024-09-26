export class MenuModel {
  idArea: number;
  idMenus: MenuSubMenuModel[] = [];
}

export class MenuSubMenuModel {
  menuId: number;
  subMenusId: number[] = [];
}
