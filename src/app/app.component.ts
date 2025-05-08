import { Component } from '@angular/core';
import { GuessingByTheFlagComponent } from './guessing-by-the-flag/guessing-by-the-flag.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GuessingByTheFlagComponent],
  template: `<app-guessing-by-the-flag></app-guessing-by-the-flag>`,
})
export class AppComponent {}
