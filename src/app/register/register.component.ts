import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const success = this.auth.register(this.username, this.password);
    this.message = success ? '✅ Rejestracja udana!' : '❌ Wypełnij wszystkie pola.';
    if (success) {
      this.router.navigate(['/login']);
    }
  }

  przejdzDoMenu() {
    this.router.navigate(['/']);
  }
}
