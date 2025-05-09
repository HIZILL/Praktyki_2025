import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GameSettingsService } from '../game-settings.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-guessing-by-the-flag',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './guessing-by-the-flag.component.html',
  styleUrls: ['./guessing-by-the-flag.component.scss']
})
export class GuessingByTheFlagComponent implements OnDestroy {
  kraje: any[] = [];
  obecnyKraj: any = null;
  opcje: string[] = [];
  czySprawdzono = false;
  czyPoprawna = false;
  punkty = 0;
  bledy = 0;
  czas: number;
  timer: any = null;
  graSkonczona = false;

  constructor(
    private http: HttpClient,
    public settings: GameSettingsService,
    private router: Router
  ) {
    this.czas = this.settings.czasNaOdpowiedz;

    const region = this.settings.region;
    const url =
      region === 'all'
        ? 'https://restcountries.com/v3.1/all?fields=name,flags'
        : `https://restcountries.com/v3.1/region/${region}?fields=name,flags`;

    this.http.get<any[]>(url).subscribe((data) => {
      this.kraje = data;
      this.nowaRunda();
    });
  }

  nowaRunda() {
    if (this.bledy >= this.settings.maksBledy) {
      this.graSkonczona = true;
      this.stopTimer();
      return;
    }

    this.czySprawdzono = false;
    this.czyPoprawna = false;
    this.czas = this.settings.czasNaOdpowiedz;
    this.startTimer();

    const iloscOpcji = 3;
    const losoweKraje = this.shuffle([...this.kraje]).slice(0, iloscOpcji);
    this.obecnyKraj = losoweKraje[Math.floor(Math.random() * losoweKraje.length)];
    this.opcje = losoweKraje.map(kraj => kraj.name.common);
  }

  sprawdz(wybor: string) {
    this.stopTimer();
    this.czySprawdzono = true;
    this.czyPoprawna = wybor === this.obecnyKraj.name.common;

    if (this.czyPoprawna) {
      this.punkty++;
    } else {
      this.bledy++;
    }

    if (this.bledy >= this.settings.maksBledy) {
      this.graSkonczona = true;
    }
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.czas--;
      if (this.czas <= 0) {
        this.sprawdz("Błędna odpowiedź - czas minął");
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  resetujGre() {
    this.punkty = 0;
    this.bledy = 0;
    this.graSkonczona = false;
    this.nowaRunda();
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
