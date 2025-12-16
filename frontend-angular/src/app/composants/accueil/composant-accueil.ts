import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="hero">
      <div class="conteneur">
        <h1>Bienvenue sur votre Plateforme de Réservation</h1>
        <p class="sous-titre">Réservez vos vols et hôtels en toute simplicité</p>
        
        <div class="grille-fonctionnalites">
          <div class="carte-fonctionnalite">
            <div class="icone">✈️</div>
            <h3>Vols</h3>
            <p>Recherchez et réservez des vols vers toutes les destinations</p>
            <button class="btn btn-primaire" routerLink="/vols">Voir les vols</button>
          </div>
          
          <div class="carte-fonctionnalite">
            <div class="icone">🏨</div>
            <h3>Hôtels</h3>
            <p>Trouvez l'hébergement parfait pour votre séjour</p>
            <button class="btn btn-primaire" routerLink="/hotels">Voir les hôtels</button>
          </div>
          
          <div class="carte-fonctionnalite">
            <div class="icone">📋</div>
            <h3>Réservations</h3>
            <p>Gérez toutes vos réservations en un seul endroit</p>
            <button class="btn btn-primaire" routerLink="/reservations">Mes réservations</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .sous-titre {
      font-size: 1.5rem;
      margin-bottom: 3rem;
      opacity: 0.9;
    }

    .grille-fonctionnalites {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .carte-fonctionnalite {
      background: white;
      color: #1e293b;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .carte-fonctionnalite:hover {
      transform: translateY(-5px);
    }

    .icone {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .carte-fonctionnalite h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #667eea;
    }

    .carte-fonctionnalite p {
      margin-bottom: 1.5rem;
      color: #64748b;
    }
  `]
})
export class ComposantAccueil implements OnInit {
  ngOnInit(): void {}
}
