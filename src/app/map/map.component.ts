import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

import { RouterModule, Router } from '@angular/router';
import type { Feature } from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [RouterModule],
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router) {}

  map: Map | undefined;

  @ViewChild('map', { static: false })
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'KX7bujj98HnA2Kyjh033';
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
            const countryName = props['ADMIN'] || props['name'] || 'Nieznany kraj';
            console.log('Kliknięto kraj:', countryName);
          } else {
            console.log('Nie kliknięto w żaden kraj.');
          }
        });

        setTimeout(() => this.map?.resize(), 300);
      });

      this.map.on('moveend', () => {
        const center = this.map?.getCenter();
        const zoom = this.map?.getZoom();
        console.log('Nowe centrum:', center);
        console.log('Nowy zoom:', zoom);
      });
    } else {
      console.log('Mapa się jeszcze nie wczytała');
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
