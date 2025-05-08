import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-guessing-by-the-flag',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './guessing-by-the-flag.component.html',
  styleUrls: ['./guessing-by-the-flag.component.scss']
})
export class GuessingByTheFlagComponent {
  kraje: any[] = [];
  obecnyKraj: any = null;
  opcje: string[] = [];
  czySprawdzono = false;
  czyPoprawna = false;
  punkty = 0;

  constructor(private http: HttpClient) {
    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags')
      .subscribe((data) => {
        this.kraje = data;
        this.nowaRunda();
      });
  }

  nowaRunda() {
    this.czySprawdzono = false;
    this.czyPoprawna = false;

    const losoweKraje = this.shuffle([...this.kraje]).slice(0, 3);
    this.obecnyKraj = losoweKraje[Math.floor(Math.random() * 3)];
    this.opcje = losoweKraje.map(kraj => kraj.name.common);
  }

  sprawdz(wybor: string) {
    this.czySprawdzono = true;
    this.czyPoprawna = wybor === this.obecnyKraj.name.common;
    if (this.czyPoprawna) this.punkty++;
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
