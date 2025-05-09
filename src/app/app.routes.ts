import { Routes } from '@angular/router';
import { MainMenuComponent} from './main-menu/main-menu.component';
import { GuessingByTheFlagComponent } from './guessing-by-the-flag/guessing-by-the-flag.component';
import { GuessingByCapitalComponent } from './guessing-by-the-capital-city/guessing-by-the-capital-city.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'graFlaga', component: GuessingByTheFlagComponent },
  { path: 'graStolica', component: GuessingByCapitalComponent },
  { path: 'ustawienia', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];