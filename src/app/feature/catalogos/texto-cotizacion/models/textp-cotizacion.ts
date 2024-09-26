export interface AddTextoCotizacionModel {
  name: string;
  noteText: string;
}

export interface TextoCotizacionModel extends AddTextoCotizacionModel {
  id: number;
}
