import {Component, inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CurrencyService} from '../../services/currency.service';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  exchangeRates$!: Observable<any>;
  currencyService = inject(CurrencyService);

  ngOnInit() {
    this.currencyService.getExchangeRates().subscribe({
      next: data => console.log(data),
      error: error => console.log(error),
    });
  }
}
