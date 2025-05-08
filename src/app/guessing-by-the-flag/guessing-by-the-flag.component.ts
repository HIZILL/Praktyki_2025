import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-guessing-by-the-flag',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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
  czas = 10;
  timer: any = null;
  graSkonczona = false;

  constructor(private http: HttpClient) {
    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags')
      .subscribe((data) => {
        this.kraje = data;
        this.nowaRunda();
      });
  }

  nowaRunda() {
    if (this.bledy >= 3) {
      this.graSkonczona = true;
      this.stopTimer();
      return;
    }

    this.czySprawdzono = false;
    this.czyPoprawna = false;
    this.czas = 10;
    this.startTimer();

    const losoweKraje = this.shuffle([...this.kraje]).slice(0, 3);
    this.obecnyKraj = losoweKraje[Math.floor(Math.random() * 3)];
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

    if (this.bledy >= 3) {
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
}