import { Component } from '@angular/core';
import { ServiceAuth } from './services/service-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-racine',
  template: `
    <nav class="navigation">
      <div class="conteneur">
        <div class="nav-contenu">
          <h1 class="logo">✈️ Réservation Voyages</h1>
          <ul class="nav-liens">
            <li><a routerLink="/" routerLinkActive="actif" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li *ngIf="isAuthenticated"><a routerLink="/destinations" routerLinkActive="actif">Destinations</a></li>
            <li *ngIf="isAuthenticated"><a routerLink="/reservations" routerLinkActive="actif">Mes Réservations</a></li>
          </ul>
          <div class="auth-section">
            <span *ngIf="isAuthenticated" class="user-info">
              {{ currentUser?.email }} 
              <span class="role-badge" [class.admin]="isAdmin">{{ isAdmin ? 'ADMIN' : 'USER' }}</span>
            </span>
            <button *ngIf="!isAuthenticated" class="btn-auth" routerLink="/login">Connexion</button>
            <button *ngIf="!isAuthenticated" class="btn-auth btn-register" routerLink="/register">Inscription</button>
            <button *ngIf="isAuthenticated" class="btn-auth btn-logout" (click)="logout()">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navigation {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-contenu {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-liens {
      display: flex;
      list-style: none;
      gap: 2rem;
      flex: 1;
      margin-left: 2rem;
    }

    .nav-liens a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .nav-liens a:hover,
    .nav-liens a.actif {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .role-badge {
      background-color: rgba(255, 255, 255, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .role-badge.admin {
      background-color: #ffc107;
      color: #333;
    }

    .btn-auth {
      padding: 0.5rem 1rem;
      border: 1px solid white;
      background-color: transparent;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-auth:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .btn-register {
      background-color: white;
      color: #667eea;
    }

    .btn-register:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }

    .btn-logout {
      background-color: rgba(255, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-logout:hover {
      background-color: rgba(255, 0, 0, 0.5);
    }

    main {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class ComposantApp {
  titre = 'Plateforme de Réservation de Voyages';

  constructor(
    public authService: ServiceAuth,
    private router: Router
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
