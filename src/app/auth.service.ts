import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly cookieName = 'auth_user';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const storedUsers = this.getStoredUsers();
    const user = storedUsers.find(u => u.username === username && u.password === password);

    if (user) {
      document.cookie = `${this.cookieName}=${encodeURIComponent(username)}; path=/; max-age=604800`;
      return true;
    }

    return false;
  }

  register(username: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users = this.getStoredUsers();
    if (users.some(u => u.username === username)) return false;

    users.push({ username, password });
    document.cookie = `${this.cookieName}=${encodeURIComponent(username)}; path=/; max-age=604800`;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  logout() {
    if (!this.isBrowser) return;
    document.cookie = `${this.cookieName}=; path=/; max-age=0`;
  }

  getUsername(): string | null {
    if (!this.isBrowser) return null;
    const match = document.cookie.match(new RegExp(`(^| )${this.cookieName}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUsername();
  }

  private getStoredUsers(): { username: string, password: string }[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }
}
