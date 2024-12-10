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

    // Если данные в кеше и они не устарели
    if (this.cache && Array.isArray(this.cache) && this.lastUpdated && now.getTime() - this.lastUpdated.getTime() < this.cacheTTL) {
      return of(this.cache); // Возвращаем кешированные данные
    }

    // Иначе запрашиваем данные из API
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
        console.log('Количество элементов:', data.length); // Лог количества элементов
        console.log('Пример данных:', data[0]); // Лог первого элемента
      }),
      map((data) => {
        // Преобразуем данные в CurrencyInterface[]
        return data.map((item): CurrencyInterface => ({
          r030: item.r030,
          txt: item.txt,
          rate: item.rate,
          cc: item.cc,
          exchangedate: item.exchangedate,
        }));
      }),
      tap((data) => {
        console.log(data);
        this.cache = data; // Сохраняем данные в кеш
        this.lastUpdated = new Date(); // Обновлямя
      })
    );
  }


}
