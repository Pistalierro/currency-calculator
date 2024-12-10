import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {CurrencyInterface} from '../types/currency.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
  private cache: CurrencyInterface[] | null = null;
  private lastUpdated: Date | null = null;
  private cacheTTL = 60 * 60 * 1000;

  getExchangeRates(): Observable<CurrencyInterface[]> {
    const now = new Date();
    if (this.cache && Array.isArray(this.cache) && this.lastUpdated && now.getTime() - this.lastUpdated.getTime() < this.cacheTTL) {
      return of(this.cache);
      
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
      }),
      map((data) => data.map((item) => ({
        r030: item.r030,
        txt: item.txt,
        rate: item.rate,
        cc: item.cc,
        exchangedate: item.exchangedate,
      }))),
      tap((transformedData) => {
        this.cache = transformedData;
        this.lastUpdated = new Date();
      })
    );
  }

  getLastUpdatedTime(): string | null {
    if (!this.lastUpdated) {
      return null;
    }
    return this.lastUpdated.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
  }

  clearCache(): void {
    this.cache = null;
    this.lastUpdated = null;
  }
}
