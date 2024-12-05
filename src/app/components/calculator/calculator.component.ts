import {Component, inject, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {CurrencyService} from '../../services/currency.service';
import {ResponseExchangeInterface} from '../../types/response-exchange.interface';
import {SUPPORTED_CURRENCIES} from '../../mock/supported-currancies';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [
    FormsModule,
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  exchangeRates$!: Observable<{ [key: string]: number }>;
  currencyService = inject(CurrencyService);

  amount: number = 0;
  fromCurrency: string = 'UAH';
  toCurrency: string = 'USD';
  result: number | null = null;
  supportedCurrencies = SUPPORTED_CURRENCIES;

  ngOnInit() {
    // Получаем курсы валют и преобразуем их в объект с парами "код валюты: курс"
    this.exchangeRates$ = this.currencyService.getExchangeRates().pipe(
      map((data: ResponseExchangeInterface[]) => {
        return data.reduce((acc: { [key: string]: number }, rate: ResponseExchangeInterface) => {
          if (SUPPORTED_CURRENCIES.find(currency => currency.code === rate.cc)) {
            acc[rate.cc] = rate.rate;
          }
          return acc;
        }, {});
      })
    );
  }

  convert(exchangeRates: { [key: string]: number }) {
    if (this.fromCurrency === this.toCurrency) {
      // Если валюты одинаковые, сумма остается неизменной
      this.result = this.amount;
    } else if (this.fromCurrency === 'UAH') {
      // Конвертация из гривны в другую валюту
      this.result = this.amount / exchangeRates[this.toCurrency];
    } else if (this.toCurrency === 'UAH') {
      // Конвертация из другой валюты в гривну
      this.result = this.amount * exchangeRates[this.fromCurrency];
    } else {
      // Конвертация между двумя иностранными валютами через гривну
      const amountInUah = this.amount * exchangeRates[this.fromCurrency];
      this.result = amountInUah / exchangeRates[this.toCurrency];
    }
  }
}
