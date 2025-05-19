import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'Id95jxtToAOuyq24h6di';
  }

  ngAfterViewInit() {
    const initialState = { lng: 16, lat: 19, zoom: 1 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map?.on('moveend', () => {
    const center = this.map?.getCenter();
    const zoom = this.map?.getZoom();
    console.log('Nowe centrum:', center);
    console.log('Nowy zoom:', zoom);
  });

    this.map.on('click', (event) => {
      console.log('Klik:', event.lngLat);
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}