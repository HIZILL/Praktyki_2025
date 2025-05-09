import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSettingsService } from '../game-settings.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  czasNaOdpowiedz!: number;
  maksBledy!: number;
  region!: string;

  constructor(private settings: GameSettingsService, private router: Router) {
    this.czasNaOdpowiedz = this.settings.czasNaOdpowiedz;
    this.maksBledy = this.settings.maksBledy;
    this.region = this.settings.region;
  }

  zapisz() {
    this.settings.setCzas(this.czasNaOdpowiedz);
    this.settings.setMaksBledy(this.maksBledy);
    this.settings.setRegion(this.region);
    alert('Ustawienia zapisane ✅');
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
