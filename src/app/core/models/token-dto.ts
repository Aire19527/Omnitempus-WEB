import { AreaMenu } from '../menu/models/menu';

export interface TokenDto {
  token: string;
  expiration: number;
  areaMenus: AreaMenu[];
}
