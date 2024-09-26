export interface AddCliente {
  name: string;
  nit: string;
  payTypeSunday: string;
}

export interface Cliente extends AddCliente {
  id: number;
}
