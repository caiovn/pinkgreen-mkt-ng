import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CepInterface } from '../models/cep.model';
import { StateInterface } from '../models/states.model';

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  constructor(private http: HttpClient) {}

  getCep(cep: string): Observable<CepInterface> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<CepInterface>(url);
  }

  getStates(): Observable<StateInterface[]> {
    const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

    return this.http.get<StateInterface[]>(url);
  }
}
