import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const success = this.auth.register(this.username, this.password);
    if (success) {
      this.message = '✅ Rejestracja zakończona sukcesem! Zostaniesz zalogowany.';
      setTimeout(() => this.router.navigate(['/']), 1500);
    } else {
      this.message = '❌ Użytkownik o tej nazwie już istnieje.';
    }
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
