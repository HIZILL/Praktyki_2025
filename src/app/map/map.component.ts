import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private map: any;

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');

      if (!this.map) {
        this.map = L.map('map').setView([20, 0], 2);
      }

      if (this.map.hasLayer('tileLayer') === false) {
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          id: 'tileLayer'
        }).addTo(this.map);
      }

      this.http.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .subscribe((geoJsonData: any) => {
          L.geoJSON(geoJsonData).addTo(this.map);
        });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    }
  }
}
