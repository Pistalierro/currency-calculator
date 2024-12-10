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
  currentTime = signal<string>('');
  supportedCurrencies = SUPPORTED_CURRENCIES;
  baseCurrency = 'UAH';
  lastUpdated: string | null = null;
  private fb = inject(FormBuilder);
  private currencyService = inject(CurrencyService);

  ngOnInit(): void {
    this.getExchangeRates();
    this.initializeForm();
    this.startClock();
  }

  calculate(): void {
    const {amount, fromCurrency, toCurrency} = this.form.value;

    if (!amount || !fromCurrency || !toCurrency) {
      this.result.set(null);
      return;
    }
    const fromRate = this.getRate(fromCurrency);
    const toRate = this.getRate(toCurrency);

    if (!fromRate || !toRate) {
      this.result.set(null);
      return;
    }

    const converted = (amount * fromRate) / toRate;
    this.result.set(Number(converted.toFixed(2)));
  }

  refreshRates(): void {
    console.log('click');
    this.currencyService.clearCache();
    this.getExchangeRates();
  }

  getExchangeRates(): void {
    this.currencyService.getExchangeRates().subscribe((data) => {
      const filtered = data.filter((currency: CurrencyInterface) =>
        this.supportedCurrencies.some((supported) => supported.code === currency.cc)
      );
      this.currencies.set(filtered);
      this.lastUpdated = this.currencyService.getLastUpdatedTime();
    });
  }

  private startClock(): void {
    setInterval(() => {
      const now = new Date();
      this.currentTime.set(now.toLocaleTimeString());
    }, 1000);
  }

  private getRate(currency: string): number {
    return currency === this.baseCurrency ? 1 : this.currencies().find((c) => c.cc === currency)?.rate ?? 0;
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      fromCurrency: ['UAH', [Validators.required]],
      toCurrency: ['USD', [Validators.required]],
    });
    this.form.valueChanges.subscribe(() => {
      this.calculate();
    });
  }
}
