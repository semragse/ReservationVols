import { Component, OnInit } from '@angular/core';
import { ServiceHotel } from '../../services/service-hotel';

@Component({
  selector: 'app-liste-hotels',
  template: `
    <div class="conteneur">
      <h2>Liste des Hôtels Disponibles</h2>
      <div class="carte filtres">
        <h3>Filtrer les hôtels</h3>
        <div class="filtres-grille">
          <div class="groupe-champ">
            <label>Ville</label>
            <input type="text" [(ngModel)]="filtres.ville" placeholder="Casablanca" (ngModelChange)="appliquerFiltres()" />
          </div>
          <div class="groupe-champ">
            <label>Pays</label>
            <input type="text" [(ngModel)]="filtres.pays" placeholder="Maroc" (ngModelChange)="appliquerFiltres()" />
          </div>
          <div class="groupe-champ">
            <label>Étoiles</label>
            <select [(ngModel)]="filtres.etoiles" (change)="appliquerFiltres()">
              <option value="">Toutes</option>
              <option *ngFor="let etoile of etoilesOptions" [value]="etoile">{{ etoile }} ★</option>
            </select>
          </div>
          <div class="groupe-champ">
            <label>Chambres min.</label>
            <input type="number" min="1" [(ngModel)]="filtres.chambres" placeholder="1" (ngModelChange)="appliquerFiltres()" />
          </div>
        </div>
      </div>

      <div *ngIf="chargement" class="etat etat-info">
        <div class="spinner"></div>
        <span>Chargement des hôtels...</span>
      </div>

      <div *ngIf="!chargement && erreur" class="etat etat-erreur">
        {{ erreur }}
      </div>

      <div *ngIf="!chargement && !erreur && hotelsFiltres.length === 0" class="etat etat-info">
        Aucun hôtel ne correspond à vos critères pour le moment.
      </div>

      <div class="grille-cartes" *ngIf="!chargement && !erreur">
        <div class="carte carte-hotel" *ngFor="let hotel of hotelsFiltres">
          <div class="entete">
            <div>
              <h3>{{ hotel.nom }}</h3>
              <div class="meta">
                <span class="badge">{{ hotel.etoiles }} ★</span>
                <span>{{ hotel.ville }}, {{ hotel.pays }}</span>
              </div>
            </div>
            <div class="prix">
              <span>{{ hotel.prixParNuit | currency:'EUR':'symbol':'1.0-0' }}</span>
              <small>{{ convertirEnDirham(hotel.prixParNuit) }} MAD</small>
            </div>
          </div>
          <p class="description">{{ hotel.description }}</p>
          <div class="infos">
            <div>
              <strong>Chambres</strong>
              <span>{{ hotel.chambresDisponibles }} / {{ hotel.nombreChambres }}</span>
            </div>
            <div>
              <strong>Contact</strong>
              <span>{{ hotel.telephone || '—' }}</span>
            </div>
            <div>
              <strong>Email</strong>
              <span>{{ hotel.email || '—' }}</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn btn-primaire" [disabled]="hotel.chambresDisponibles === 0">{{ hotel.chambresDisponibles === 0 ? 'Complet' : 'Réserver' }}</button>
            <span class="statut" [class.dispo]="hotel.chambresDisponibles > 0" [class.indispo]="hotel.chambresDisponibles === 0">
              {{ hotel.chambresDisponibles > 0 ? 'Disponible' : 'Complet' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .filtres h3 {
      margin-bottom: 1rem;
      color: #475569;
    }

    .filtres-grille {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .groupe-champ label {
      display: block;
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .groupe-champ input,
    .groupe-champ select {
      width: 100%;
      padding: 0.45rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.95rem;
    }

    .etat {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .etat-info {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .etat-erreur {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid #cbd5f5;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .grille-cartes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .carte-hotel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-left: 4px solid #6366f1;
    }

    .entete {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
    }

    .meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .badge {
      background: #eef2ff;
      color: #4338ca;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-weight: 600;
    }

    .prix {
      text-align: right;
      color: #0f172a;
    }

    .prix span {
      font-size: 1.25rem;
      font-weight: 600;
      display: block;
    }

    .prix small {
      color: #94a3b8;
    }

    .description {
      color: #475569;
      margin: 0;
      min-height: 48px;
    }

    .infos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.75rem;
      font-size: 0.9rem;
      color: #475569;
    }

    .infos strong {
      display: block;
      color: #94a3b8;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn {
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s ease;
    }

    .btn-primaire {
      background: #6366f1;
      color: #fff;
    }

    .btn[disabled] {
      background: #cbd5f5;
      cursor: not-allowed;
    }

    .statut {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .statut.dispo {
      color: #16a34a;
    }

    .statut.indispo {
      color: #dc2626;
    }
  `]
})
export class ComposantListeHotels implements OnInit {
  hotels: any[] = [];
  hotelsFiltres: any[] = [];
  chargement = false;
  erreur = '';
  filtres = {
    ville: '',
    pays: '',
    etoiles: '',
    chambres: ''
  };
  etoilesOptions = [1, 2, 3, 4, 5];

  constructor(private serviceHotel: ServiceHotel) {}

  ngOnInit(): void {
    this.chargerHotels();
  }

  chargerHotels(): void {
    this.chargement = true;
    this.erreur = '';
    this.serviceHotel.obtenirTousLesHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.hotelsFiltres = hotels;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Impossible de récupérer les hôtels pour le moment. Veuillez réessayer plus tard.';
        this.chargement = false;
      }
    });
  }

  appliquerFiltres(): void {
    const { ville, pays, etoiles, chambres } = this.filtres;
    this.hotelsFiltres = this.hotels.filter((hotel) => {
      const correspondVille = ville ? hotel.ville?.toLowerCase().includes(ville.toLowerCase()) : true;
      const correspondPays = pays ? hotel.pays?.toLowerCase().includes(pays.toLowerCase()) : true;
      const correspondEtoiles = etoiles ? hotel.etoiles === Number(etoiles) : true;
      const correspondChambres = chambres ? hotel.chambresDisponibles >= Number(chambres) : true;
      return correspondVille && correspondPays && correspondEtoiles && correspondChambres;
    });
  }

  convertirEnDirham(prixEuro: number): string {
    const taux = 10.5; // taux statique utilisé également côté backend
    return (prixEuro * taux).toFixed(2);
  }
}
