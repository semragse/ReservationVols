import { Component } from '@angular/core';

@Component({
  selector: 'app-racine',
  template: `
    <nav class="navigation">
      <div class="conteneur">
        <div class="nav-contenu">
          <h1 class="logo">✈️ Réservation Voyages</h1>
          <ul class="nav-liens">
            <li><a routerLink="/" routerLinkActive="actif" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li><a routerLink="/vols" routerLinkActive="actif">Vols</a></li>
            <li><a routerLink="/hotels" routerLinkActive="actif">Hôtels</a></li>
            <li><a routerLink="/reservations" routerLinkActive="actif">Mes Réservations</a></li>
          </ul>
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

    main {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class ComposantApp {
  titre = 'Plateforme de Réservation de Voyages';
}
