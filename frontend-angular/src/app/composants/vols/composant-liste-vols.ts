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
    import { ServiceAuth } from '../../services/service-auth';
      color: #1e293b;
      margin-bottom: 2rem;
    }
          <div *ngIf="isAdmin" class="carte carte-admin">
            <div class="entete-admin">
              <div>
                <h3>{{ editionEnCours ? 'Modifier un vol' : 'Créer un vol' }}</h3>
                <p class="sous-texte">Actions réservées aux administrateurs</p>
              </div>
              <div class="actions-rapides">
                <button class="btn btn-primaire" (click)="demarrerCreation()">Nouveau vol</button>
              </div>
            </div>

            <form class="grille-formulaire" (ngSubmit)="sauvegarderVol()">
              <label class="champ">
                <span>Numéro de vol</span>
                <input name="numeroVol" [(ngModel)]="formVol.numeroVol" required />
              </label>
              <label class="champ">
                <span>Compagnie</span>
                <input name="compagnie" [(ngModel)]="formVol.compagnie" required />
              </label>
              <label class="champ">
                <span>Ville de départ</span>
                <input name="villeDepart" [(ngModel)]="formVol.villeDepart" required />
              </label>
              <label class="champ">
                <span>Ville d'arrivée</span>
                <input name="villeArrivee" [(ngModel)]="formVol.villeArrivee" required />
              </label>
              <label class="champ">
                <span>Date de départ</span>
                <input type="datetime-local" name="dateDepart" [(ngModel)]="formVol.dateDepart" required />
              </label>
              <label class="champ">
                <span>Date d'arrivée</span>
                <input type="datetime-local" name="dateArrivee" [(ngModel)]="formVol.dateArrivee" required />
              </label>
              <label class="champ">
                <span>Places totales</span>
                <input type="number" min="1" name="nombrePlaces" [(ngModel)]="formVol.nombrePlaces" required />
              </label>
              <label class="champ">
                <span>Prix (€)</span>
                <input type="number" step="0.01" min="0" name="prix" [(ngModel)]="formVol.prix" required />
              </label>
              <div class="actions-formulaire">
                <button type="submit" class="btn btn-primaire">{{ editionEnCours ? 'Enregistrer les modifications' : 'Ajouter le vol' }}</button>
                <button type="button" class="btn btn-secondaire" (click)="demarrerCreation()">Annuler</button>
              </div>
            </form>
          </div>

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

    .actions-vol {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .actions-admin-vol {
      display: flex;
      gap: 0.5rem;
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

    .carte-admin {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .entete-admin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .sous-texte {
      margin: 0;
      color: #94a3b8;
    }

    .grille-formulaire {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .champ {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
      color: #334155;
    }

    .champ input {
      padding: 0.6rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.95rem;
    }

    .actions-formulaire {
      display: flex;
      gap: 0.75rem;
      align-items: center;
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
  formVol: any = this.nouveauFormulaire();
  editionEnCours = false;

  constructor(
    private serviceVol: ServiceVol,
    private serviceReservation: ServiceReservation,
    private serviceAuth: ServiceAuth
  ) {}

  get isAdmin(): boolean {
    return this.serviceAuth.isAdmin;
  }

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
    this.chargement = true;
    
    if (this.recherche.villeDepart || this.recherche.villeArrivee) {
      this.serviceVol.obtenirTousLesVols().subscribe({
        next: (data) => {
          // Filtrer les vols selon les critères de recherche
          this.vols = data.filter((vol: any) => {
            const correspondDepart = !this.recherche.villeDepart || 
              vol.villeDepart.toLowerCase().includes(this.recherche.villeDepart.toLowerCase());
            const correspondArrivee = !this.recherche.villeArrivee || 
              vol.villeArrivee.toLowerCase().includes(this.recherche.villeArrivee.toLowerCase());
            return correspondDepart && correspondArrivee;
          });
          this.chargement = false;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche des vols', err);
          this.chargement = false;
        }
      });
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

  demarrerCreation(): void {
    this.formVol = this.nouveauFormulaire();
    this.editionEnCours = false;
  }

  editerVol(vol: any): void {
    this.editionEnCours = true;
    this.formVol = {
      id: vol.id,
      numeroVol: vol.numeroVol,
      compagnie: vol.compagnie,
      villeDepart: vol.villeDepart,
      villeArrivee: vol.villeArrivee,
      dateDepart: this.formatDateTimeLocal(vol.dateDepart),
      dateArrivee: this.formatDateTimeLocal(vol.dateArrivee),
      nombrePlaces: vol.nombrePlaces,
      prix: vol.prix
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sauvegarderVol(): void {
    const payload = {
      numeroVol: this.formVol.numeroVol,
      compagnie: this.formVol.compagnie,
      villeDepart: this.formVol.villeDepart,
      villeArrivee: this.formVol.villeArrivee,
      dateDepart: new Date(this.formVol.dateDepart).toISOString(),
      dateArrivee: new Date(this.formVol.dateArrivee).toISOString(),
      nombrePlaces: Number(this.formVol.nombrePlaces),
      prix: Number(this.formVol.prix)
    };

    const action$ = this.editionEnCours && this.formVol.id
      ? this.serviceVol.mettreAJourVol(this.formVol.id, payload)
      : this.serviceVol.creerVol(payload);

    action$.subscribe({
      next: () => {
        this.demarrerCreation();
        this.chargerVols();
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde du vol', err);
        alert('Impossible de sauvegarder le vol.');
      }
    });
  }

  supprimerVol(vol: any): void {
    const confirmation = confirm(`Supprimer le vol ${vol.numeroVol} ?`);
    if (!confirmation) {
      return;
    }

    this.serviceVol.supprimerVol(vol.id).subscribe({
      next: () => this.chargerVols(),
      error: (err) => {
        console.error('Erreur lors de la suppression du vol', err);
        alert('Impossible de supprimer le vol.');
      }
    });
  }

  private nouveauFormulaire() {
    return {
      id: null,
      numeroVol: '',
      compagnie: '',
      villeDepart: '',
      villeArrivee: '',
      dateDepart: '',
      dateArrivee: '',
      nombrePlaces: 0,
      prix: 0
    };
  }

  private formatDateTimeLocal(date: string): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    const pad = (v: number) => v.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
