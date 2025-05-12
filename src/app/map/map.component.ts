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

      // Tworzymy mapę raz
      if (!this.map) {
        this.map = L.map('map').setView([20, 0], 2); // Ustawiamy widok początkowy
      }

      // Dodajemy tylko jedną warstwę mapy
      if (this.map.hasLayer('tileLayer') === false) {
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          id: 'tileLayer'  // Przypisujemy id, żeby łatwiej było sprawdzić, czy warstwa już istnieje
        }).addTo(this.map);
      }

      // Wczytanie danych geoJSON raz
      this.http.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .subscribe((geoJsonData: any) => {
          // Dodajemy tylko raz dane geoJSON
          L.geoJSON(geoJsonData).addTo(this.map);
        });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.map.invalidateSize(); // Zwiększamy rozmiar mapy po załadowaniu
      }, 200);
    }
  }
}
