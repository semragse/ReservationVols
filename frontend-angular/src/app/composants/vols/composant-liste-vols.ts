import { Component, OnInit } from '@angular/core';
import { ServiceVol } from '../../services/service-vol';
import { ServiceReservation } from '../../services/service-reservation';

@Component({
  selector: 'app-liste-vols',
  template: `
    <div class="conteneur">
      <h2>Liste des Vols Disponibles</h2>
      
      <div class="carte">
        <h3>Rechercher un vol</h3>
        <div class="formulaire-recherche">
          <div class="formulaire-groupe">
            <label>Ville de départ</label>
            <input type="text" [(ngModel)]="recherche.villeDepart" placeholder="Paris">
          </div>
          <div class="formulaire-groupe">
            <label>Ville d'arrivée</label>
            <input type="text" [(ngModel)]="recherche.villeArrivee" placeholder="New York">
          </div>
          <button class="btn btn-primaire" (click)="rechercherVols()">Rechercher</button>
        </div>
      </div>

      <div *ngIf="chargement" class="chargement">
        <div class="spinner"></div>
        <p>Chargement des vols...</p>
      </div>

      <div *ngIf="!chargement && vols.length === 0" class="alerte alerte-info">
        Aucun vol disponible pour le moment.
      </div>

      <div class="grille-cartes">
        <div *ngFor="let vol of vols" class="carte carte-vol">
          <div class="entete-vol">
            <h3>{{ vol.numeroVol }}</h3>
            <span class="badge">{{ vol.compagnie }}</span>
          </div>
          <div class="details-vol">
            <div class="trajet">
              <span class="ville">{{ vol.villeDepart }}</span>
              <span class="fleche">→</span>
              <span class="ville">{{ vol.villeArrivee }}</span>
            </div>
            <div class="info">
              <p><strong>Départ:</strong> {{ vol.dateDepart | date:'dd/MM/yyyy HH:mm' }}</p>
              <p><strong>Arrivée:</strong> {{ vol.dateArrivee | date:'dd/MM/yyyy HH:mm' }}</p>
              <p><strong>Places disponibles:</strong> {{ vol.placesDisponibles }} / {{ vol.nombrePlaces }}</p>
            </div>
          </div>
          <div class="pied-vol">
            <div class="prix-container">
              <span class="prix">{{ vol.prix }} €</span>
              <span class="prix-mad">{{ (vol.prix * 10.50).toFixed(2) }} MAD</span>
            </div>
            <button class="btn btn-primaire" 
                    [disabled]="vol.placesDisponibles === 0"
                    (click)="reserverVol(vol)">
              {{ vol.placesDisponibles === 0 ? 'Complet' : 'Réserver' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      color: #1e293b;
      margin-bottom: 2rem;
    }

    .formulaire-recherche {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .grille-cartes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .carte-vol {
      border-left: 4px solid #667eea;
    }

    .entete-vol {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .badge {
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .trajet {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }

    .ville {
      font-weight: 600;
      color: #667eea;
    }

    .fleche {
      color: #94a3b8;
    }

    .info p {
      margin: 0.5rem 0;
      color: #64748b;
    }

    .pied-vol {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .prix-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .prix {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .prix-mad {
      font-size: 1rem;
      color: #94a3b8;
      font-weight: 500;
    }
  `]
})
export class ComposantListeVols implements OnInit {
  vols: any[] = [];
  chargement = false;
  recherche = {
    villeDepart: '',
    villeArrivee: ''
  };

  constructor(
    private serviceVol: ServiceVol,
    private serviceReservation: ServiceReservation
  ) {}

  ngOnInit(): void {
    this.chargerVols();
  }

  chargerVols(): void {
    this.chargement = true;
    this.serviceVol.obtenirTousLesVols().subscribe({
      next: (data) => {
        this.vols = data;
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des vols', err);
        this.chargement = false;
      }
    });
  }

  rechercherVols(): void {
    if (this.recherche.villeDepart && this.recherche.villeArrivee) {
      // Implémentation de la recherche
      console.log('Recherche:', this.recherche);
    } else {
      this.chargerVols();
    }
  }

  reserverVol(vol: any): void {
    // Demander le nombre de personnes
    const nombrePersonnesStr = prompt(`Combien de personnes pour le vol ${vol.numeroVol} ?`, '1');

    if (!nombrePersonnesStr) {
      return; // Utilisateur a annulé
    }

    const nombrePersonnes = parseInt(nombrePersonnesStr, 10);

    if (isNaN(nombrePersonnes) || nombrePersonnes < 1 || nombrePersonnes > vol.placesDisponibles) {
      alert(`Veuillez entrer un nombre valide entre 1 et ${vol.placesDisponibles}`);
      return;
    }

    // Créer l'objet réservation
    const reservation = {
      utilisateurId: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      numeroReservation: 'RES-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      type: 'VOL',
      volId: vol.id,
      nombrePersonnes,
      montantTotal: vol.prix * nombrePersonnes,
      statut: 'EN_ATTENTE'
    };

    // Envoyer la réservation au backend
    this.serviceReservation.creerReservation(reservation).subscribe({
      next: (response) => {
        alert(`Réservation confirmée!\nNuméro de réservation: ${response.numeroReservation}\nMontant total: ${response.montantTotal}€`);
        // Recharger les vols pour mettre à jour les places disponibles
        this.chargerVols();
      },
      error: (error) => {
        console.error('Erreur lors de la réservation:', error);
        alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      }
    });
  }
}
