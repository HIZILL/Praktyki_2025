import { Routes } from '@angular/router';
import { MainMenuComponent} from './main-menu/main-menu.component';
import { GuessingByTheFlagComponent } from './guessing-by-the-flag/guessing-by-the-flag.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'gra', component: GuessingByTheFlagComponent },
  { path: 'ustawienia', component: SettingsComponent },
];