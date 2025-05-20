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

@Component({
  selector: 'app-map',
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

  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLElement>;

  constructor(private router: Router, private http: HttpClient) {}

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
      return;
    }

    this.obecnyKraj = this.kraje[Math.floor(Math.random() * this.kraje.length)];
  }

  sprawdz(wybor: string) {
    const prawidlowa = this.obecnyKraj.name.common;

    if (wybor === prawidlowa) {
      alert(`✅ Dobrze! To był ${prawidlowa}`);
      this.punkty++;
    } else {
      alert(`❌ Źle! To był: ${prawidlowa}`);
      this.bledy++;
    }

    this.nowaRunda();
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
