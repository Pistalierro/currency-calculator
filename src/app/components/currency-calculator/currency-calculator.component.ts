import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyService} from '../../services/currency.service';
import {CurrencyInterface} from '../../types/currency.interface';
import {NgForOf, NgIf} from '@angular/common';
import {SUPPORTED_CURRENCIES} from '../../mock/supported-currencies';

@Component({
  selector: 'app-currency-calculator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './currency-calculator.component.html',
  styleUrl: './currency-calculator.component.scss'
})
export class CurrencyCalculatorComponent implements OnInit {

  form!: FormGroup;
  currencies = signal<CurrencyInterface[]>([]);
  result = signal<number | null>(null);
  supportedCurrencies = SUPPORTED_CURRENCIES;
  baseCurrency = 'UAH';
  private fb = inject(FormBuilder);
  private currencyService = inject(CurrencyService);

  get currencyList(): CurrencyInterface[] {
    return this.currencies();
  }

  ngOnInit(): void {
    this.getExchangeRates();
    this.initializeForm();
  }

  calculate(): void {
    const {amount, fromCurrency, toCurrency} = this.form.value;

    if (!amount || !fromCurrency || !toCurrency) {
      this.result.set(null);
      return;
    }

    const fromRate = fromCurrency === 'UAH' ? 1 : this.currencies().find((c) => c.cc === fromCurrency)?.rate;
    const toRate = toCurrency === 'UAH' ? 1 : this.currencies().find((c) => c.cc === toCurrency)?.rate;

    if (!fromRate || !toRate) {
      this.result.set(null);
      return;
    }

    // Рассчитать результат
    const converted = (amount * fromRate) / toRate;
    this.result.set(Number(converted.toFixed(2)));
  }


  getCurrencyName(code: string): string {
    return this.supportedCurrencies.find((c) => c.code === code)?.name || '';
  }


  private getExchangeRates(): void {
    this.currencyService.getExchangeRates().subscribe((data) => {
      // Фильтруем данные из API по поддерживаемым валютам
      const filtered = data.filter((currency: CurrencyInterface) =>
        this.supportedCurrencies.some((supported) => supported.code === currency.cc)
      );
      this.currencies.set(filtered);
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      fromCurrency: ['UAH', [Validators.required]],
      toCurrency: ['USD', [Validators.required]],
    });
    this.form.valueChanges.subscribe(() => {
      this.calculate(); // Пересчитываем результат при изменении формы
    });
  }
}
