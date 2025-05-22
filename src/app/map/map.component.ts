import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Feature } from 'geojson';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GameSettingsService } from '../game-settings.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  kraje: any[] = [];
  obecnyKraj: any = null;
  punkty = 0;
  bledy = 0;
  graSkonczona = false;
  maksBledy = 3;

  czasNaOdpowiedz = 10;
  czas: number = 10;
  timer: any = null;

  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private settings: GameSettingsService,
    private auth: AuthService
  ) {
    this.maksBledy = this.settings.maksBledy;
    this.czasNaOdpowiedz = this.settings.czasNaOdpowiedz;
  }

  ngOnInit(): void {
    config.apiKey = 'KX7bujj98HnA2Kyjh033';

    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags').subscribe(data => {
      this.kraje = data;
      this.nowaRunda();
    });
  }

  ngAfterViewInit() {
    const initialState = { lng: 16, lat: 19, zoom: 1 };

    if (this.mapContainer?.nativeElement) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });

      this.map.on('load', () => {
        this.map?.addSource('countries', {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
        });

        this.map?.addLayer({
          id: 'countries-layer',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.3
          }
        });

        this.map?.on('click', (event) => {
          const features = this.map?.queryRenderedFeatures(event.point, {
            layers: ['countries-layer']
          });

          if (features && features.length > 0) {
            const feature = features[0] as Feature;
            const props = feature.properties as { [key: string]: any };
            const countryClicked = props['ADMIN'] || props['name'];

            this.sprawdz(countryClicked);
          }
        });

        setTimeout(() => this.map?.resize(), 300);
      });
    }
  }

  nowaRunda() {
    if (this.bledy >= this.maksBledy) {
      this.graSkonczona = true;
      this.stopTimer();
      this.saveScore();
      return;
    }

    this.obecnyKraj = this.kraje[Math.floor(Math.random() * this.kraje.length)];
    this.startTimer();
  }

  sprawdz(wybor: string) {
    this.stopTimer();
    const prawidlowa = this.obecnyKraj.name.common;

    if (wybor === prawidlowa) {
      alert(`✅ Dobrze! To był ${prawidlowa}`);
      this.punkty++;
    } else {
      alert(`❌ Źle! To był: ${prawidlowa}`);
      this.bledy++;
    }

    if (this.bledy >= this.maksBledy) {
      this.graSkonczona = true;
      this.saveScore();
    } else {
      this.nowaRunda();
    }
  }

  startTimer() {
    this.stopTimer();
    this.czas = this.czasNaOdpowiedz;

    this.timer = setInterval(() => {
      this.czas--;
      if (this.czas <= 0) {
        this.stopTimer();
        alert('⏱️ Czas minął!');
        this.bledy++;
        if (this.bledy >= this.maksBledy) {
          this.graSkonczona = true;
          this.saveScore();
        } else {
          this.nowaRunda();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  saveScore() {
    const username = this.auth.getUsername();
    if (!username) return;

    const scoresJson = localStorage.getItem('userScores');
    const allScores = scoresJson ? JSON.parse(scoresJson) : {};

    if (!allScores[username]) {
      allScores[username] = [];
    }

    allScores[username].push({
      mode: 'map',
      score: this.punkty,
      timestamp: new Date().toISOString(),
      lives: this.maksBledy,
      region: this.settings.region,
      timeLimit: this.settings.czasNaOdpowiedz
    });

    localStorage.setItem('userScores', JSON.stringify(allScores));
  }

  resetujGre() {
    this.punkty = 0;
    this.bledy = 0;
    this.graSkonczona = false;
    this.nowaRunda();
  }

  przejdzDoMenu() {
    this.stopTimer();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.map?.remove();
    this.stopTimer();
  }
}
