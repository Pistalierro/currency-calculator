import {Component} from '@angular/core';
import {CurrencyCalculatorComponent} from './components/currency-calculator/currency-calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CurrencyCalculatorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
