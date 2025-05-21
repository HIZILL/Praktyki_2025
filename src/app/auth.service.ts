import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private username: string = '';

  login(username: string, password: string): boolean {
    if (username && password) {
      this.loggedIn = true;
      this.username = username;
      return true;
    }
    return false;
  }

  register(username: string, password: string): boolean {
    return !!(username && password);
  }

  logout(): void {
    this.loggedIn = false;
    this.username = '';
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string {
    return this.username;
  }
}