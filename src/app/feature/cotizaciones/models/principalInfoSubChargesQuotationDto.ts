import { SubChargesQuotationDto } from '../../catalogos/subcargos/models/elementsProvider';

export class PrincipalInfoSubChargesQuotationDto {
  id: number;
  idDepartament: string;
  idMunicipality: string;
  idPosition: number;
  idSubChargue: number;
  quotationId: number;
  subchargeFormat: string;
  count: number;

  subChargesQuotation?: SubChargesQuotationDto;
}
