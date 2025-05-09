import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  zaloguj() {
    this.router.navigate(['/login']);
  }

  zarejestruj() {
    this.router.navigate(['/register']);
  }

  wyloguj() {
    this.auth.logout();
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get username() {
    return this.auth.getUsername();
  }
}
