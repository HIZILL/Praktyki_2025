import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { GameSettingsService } from '../game-settings.service';

interface UserScore {
  mode: string;
  score: number;
  timestamp: string;
  lives: number;
  timeLimit: number;
  region: string;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  scores: UserScore[] = [];
  username: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private gameSettings: GameSettingsService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.username = this.auth.getUsername()!;
    this.loadScores();
  }

  loadScores(): void {
    const allScores = JSON.parse(localStorage.getItem('userScores') || '{}');
    const userScores = allScores[this.username] || [];

    this.scores = userScores.map((score: any) => ({
      mode: score.mode,
      score: score.score,
      timestamp: score.timestamp,
      lives: score.lives ?? this.gameSettings.maksBledy,
      region: score.region ?? 'brak danych',
      timeLimit: score.timeLimit ?? this.gameSettings.czasNaOdpowiedz
    }));
  }

  clearScores(): void {
    const allScores = JSON.parse(localStorage.getItem('userScores') || '{}');
    delete allScores[this.username];
    localStorage.setItem('userScores', JSON.stringify(allScores));
    this.scores = [];
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }
}
