import {Component} from '@angular/core';
import {CalculatorComponent} from './components/calculator/calculator.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {FooterComponent} from './components/layouts/footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [
    CalculatorComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
