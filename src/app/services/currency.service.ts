import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyInterface} from '../types/currency.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

  getExchangeRates(): Observable<CurrencyInterface[]> {
    return this.http.get<CurrencyInterface[]>(this.apiUrl);
  }
}
