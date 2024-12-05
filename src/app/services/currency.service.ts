import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseExchangeInterface} from '../types/response-exchange.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl: string = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
  private currancy = 'valcode=USD';
  private http: HttpClient = inject(HttpClient);

  getExchangeRates(): Observable<ResponseExchangeInterface[]> {
    return this.http.get<ResponseExchangeInterface[]>(`${this.apiUrl}`);
  }
}

