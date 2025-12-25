import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="hero">
      <div class="conteneur">
        <h1>Bienvenue sur votre Plateforme de Réservation</h1>
        <p class="sous-titre">Découvrez nos destinations et réservez votre voyage de rêve</p>
        
        <div class="grille-fonctionnalites">
          <div class="carte-fonctionnalite carte-principale">
            <div class="icone">🌍</div>
            <h3>Destinations</h3>
            <p>Explorez toutes nos destinations avec vols et hôtels inclus</p>
            <button class="btn btn-primaire btn-large" routerLink="/destinations">
              Découvrir les destinations
            </button>
          </div>
          
          <div class="carte-fonctionnalite">
            <div class="icone">📋</div>
            <h3>Mes Réservations</h3>
            <p>Gérez, recherchez et modifiez toutes vos réservations</p>
            <button class="btn btn-primaire" routerLink="/reservations">Voir mes réservations</button>
          </div>
        </div>

        <div class="section-avantages">
          <h2>Pourquoi choisir notre plateforme ?</h2>
          <div class="grille-avantages">
            <div class="avantage">
              <span class="icone-avantage">✓</span>
              <p>Réservation simplifiée en un clic</p>
            </div>
            <div class="avantage">
              <span class="icone-avantage">✓</span>
              <p>Vols et hôtels au même endroit</p>
            </div>
            <div class="avantage">
              <span class="icone-avantage">✓</span>
              <p>Modification facile de vos réservations</p>
            </div>
            <div class="avantage">
              <span class="icone-avantage">✓</span>
              <p>Recherche par dates disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
      min-height: 100vh;
    }

    .conteneur {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      animation: fadeInDown 0.8s;
    }

    .sous-titre {
      font-size: 1.5rem;
      margin-bottom: 3rem;
      opacity: 0.95;
      animation: fadeInUp 0.8s;
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
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .carte-principale {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 3px solid rgba(255, 255, 255, 0.3);
    }

    .carte-fonctionnalite:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    .icone {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .carte-fonctionnalite h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #667eea;
    }

    .carte-fonctionnalite p {
      margin-bottom: 1.5rem;
      color: #64748b;
      font-size: 1.1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-primaire {
      background: #667eea;
      color: white;
    }

    .btn-primaire:hover {
      background: #5568d3;
      transform: scale(1.05);
    }

    .btn-large {
      padding: 1rem 3rem;
      font-size: 1.25rem;
    }

    .section-avantages {
      margin-top: 4rem;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }

    .section-avantages h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .grille-avantages {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .avantage {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
    }

    .icone-avantage {
      font-size: 1.5rem;
      color: #10b981;
      font-weight: bold;
    }

    .avantage p {
      margin: 0;
      font-size: 1.1rem;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ComposantAccueil implements OnInit {
  ngOnInit(): void {}
}
