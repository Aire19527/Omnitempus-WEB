import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AddElementProviderDto,
  ElementProviderDto,
} from '../../catalogos/subcargos/models/elementsProvider';
import { ResponseDto } from 'src/app/models/responseDto';
import { AddBonoOT, UpdateBonoOT } from '../models/bonos-ot';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ElementypeElementService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  //capacitaciones
  getAllTrainingsByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Training/GetAllTrainingsByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addTraining(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Training`,
      model,
      options
    );
  }

  updateTraining(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Training`,
      model,
      options
    );
  }

  deleteTraining(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Training?id=${id}`,
      options
    );
  }

  //ExamenesHSE
  getAllTestsByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Test/GetAllTestsByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addTest(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Test`,
      model,
      options
    );
  }

  updateTest(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Test`,
      model,
      options
    );
  }

  deleteTest(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Test?id=${id}`,
      options
    );
  }

  //Gastos de contratación
  getAllCostHiringByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/CostHiring/GetAllCostHiringByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addCostHiring(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/CostHiring`,
      model,
      options
    );
  }

  updateCostHiring(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/CostHiring`,
      model,
      options
    );
  }

  deleteCostHiring(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/CostHiring?id=${id}`,
      options
    );
  }

  //Uniforme (Dotación)
  getAllUniformsByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Uniform/GetAllUniformsByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addUniform(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Uniform`,
      model,
      options
    );
  }

  updateUniform(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Uniform`,
      model,
      options
    );
  }

  deleteUniform(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Uniform?id=${id}`,
      options
    );
  }

  //Puesto (Dotación)
  getAllResourcesPositionByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/ResourcesPosition/GetAllResourcesPositionByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addResourcesPosition(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/ResourcesPosition`,
      model,
      options
    );
  }

  updateResourcesPosition(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/ResourcesPosition`,
      model,
      options
    );
  }

  deleteResourcesPosition(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/ResourcesPosition?id=${id}`,
      options
    );
  }

  //Comunicación)
  getAllElementsCommunicationByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/ElementsCommunication/GetAllElementsCommunicationByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addElementsCommunication(
    model: AddElementProviderDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/ElementsCommunication`,
      model,
      options
    );
  }

  updateElementsCommunication(
    model: ElementProviderDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/ElementsCommunication`,
      model,
      options
    );
  }

  deleteElementsCommunication(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/ElementsCommunication?id=${id}`,
      options
    );
  }

  //armas
  getAllWeaponByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Weapon/GetAllWeaponByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addWeapon(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Weapon`,
      model,
      options
    );
  }

  updateWeapon(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Weapon`,
      model,
      options
    );
  }

  deleteWeapon(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Weapon?id=${id}`,
      options
    );
  }

  //elementos armas
  getAllElementsWeaponByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/ElementsWeapon/GetAllElementsWeaponByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addElementsWeapon(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/ElementsWeapon`,
      model,
      options
    );
  }

  updateElementsWeapon(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/ElementsWeapon`,
      model,
      options
    );
  }

  deleteElementsWeapon(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/ElementsWeapon?id=${id}`,
      options
    );
  }

  //Vehículos
  getAllVehicleByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Vehicle/GetAllVehicleByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addVehicle(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Vehicle`,
      model,
      options
    );
  }

  updateVehicle(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Vehicle`,
      model,
      options
    );
  }

  deleteVehicle(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Vehicle?id=${id}`,
      options
    );
  }

  //elemento vehículos
  getAllElementsVehicleByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/ElementsVehicle/GetAllElementsVehicleByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addElementsVehicle(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/ElementsVehicle`,
      model,
      options
    );
  }

  updateElementsVehicle(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/ElementsVehicle`,
      model,
      options
    );
  }

  deleteElementsVehicle(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/ElementsVehicle?id=${id}`,
      options
    );
  }

  //otros elementos
  getAllElementsOtherByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/ElementsOther/GetAllElementsOtherByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addElementsOther(model: AddElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/ElementsOther`,
      model,
      options
    );
  }

  updateElementsOther(model: ElementProviderDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/ElementsOther`,
      model,
      options
    );
  }

  deleteElementsOther(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/ElementsOther?id=${id}`,
      options
    );
  }

  //bonos ot
  getAllBonusOTByQuotationId(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/BonusOT/GetAllBonusOTByQuotationId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addBonusOT(model: AddBonoOT): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/BonusOT`,
      model,
      options
    );
  }

  updateBonusOT(model: UpdateBonoOT): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/BonusOT`,
      model,
      options
    );
  }

  deleteBonusOT(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/BonusOT?id=${id}`,
      options
    );
  }
}
