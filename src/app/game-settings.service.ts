import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {
  private _czasNaOdpowiedz: number = 10;
  private _maksBledy: number = 3;

  get czasNaOdpowiedz(): number {
    return this._czasNaOdpowiedz;
  }

  setCzas(czas: number): void {
    this._czasNaOdpowiedz = czas;
  }

  get maksBledy(): number {
    return this._maksBledy;
  }

  setMaksBledy(bledy: number): void {
    this._maksBledy = bledy;
  }
}
