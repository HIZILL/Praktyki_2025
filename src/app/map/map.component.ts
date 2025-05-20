import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [RouterModule],
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor( private router: Router ){}

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

      this.map.on('moveend', () => {
        const center = this.map?.getCenter();
        const zoom = this.map?.getZoom();
        console.log('Nowe centrum:', center);
        console.log('Nowy zoom:', zoom);
      });

      this.map.on('click', (event) => {
        console.log('Klik:', event.lngLat);
      });
      setTimeout(()=>{
        this.map?.resize();
      }, 300);
    } else {
      console.log("Mapa się jeszcze niWe wczytała");
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
