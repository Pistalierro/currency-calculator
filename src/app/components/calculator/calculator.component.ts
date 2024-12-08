import {Component, inject, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {CurrencyService} from '../../services/currency.service';
import {ResponseExchangeInterface} from '../../types/response-exchange.interface';
import {SUPPORTED_CURRENCIES} from '../../mock/supported-currancies';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
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
  result: number | null = null;
  supportedCurrencies = SUPPORTED_CURRENCIES;
  calculatorForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.getExchangeRates();
    this.initializeForm();
  }

  convert(exchangeRates: { [key: string]: number }) {
    const {amount, fromCurrency, toCurrency} = this.calculatorForm.value;

    if (fromCurrency === toCurrency) {
      this.result = amount;
    } else if (fromCurrency === 'UAH') {
      this.result = amount / exchangeRates[toCurrency];
    } else if (toCurrency === 'UAH') {
      this.result = amount * exchangeRates[fromCurrency];
    } else {
      const amountInUah = amount * exchangeRates[fromCurrency];
      this.result = amountInUah / exchangeRates[toCurrency];
    }
  }

  private getExchangeRates(): void {
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

  private initializeForm(): void {
    this.calculatorForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      fromCurrency: ['UAH', [Validators.required]],
      toCurrency: ['USD', [Validators.required]],
    });
  }
}
