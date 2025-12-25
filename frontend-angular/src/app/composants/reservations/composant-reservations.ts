import { Component, OnInit } from '@angular/core';
import { ServiceReservation } from '../../services/service-reservation';
import { ServiceVol } from '../../services/service-vol';
import { ServiceHotel } from '../../services/service-hotel';
import { ServiceAuth } from '../../services/service-auth';

@Component({
  selector: 'app-reservations',
  template: `
    <div class="conteneur">
      <h2>Mes Réservations</h2>
      
      <div *ngIf="chargement" class="chargement">
        Chargement des réservations...
      </div>

      <div *ngIf="!chargement && reservations.length === 0" class="carte">
        <p class="info-message">Vous n'avez aucune réservation pour le moment.</p>
        <p *ngIf="infoMessage" class="info-message">{{ infoMessage }}</p>
      </div>

      <div *ngIf="!chargement && reservations.length > 0" class="liste-reservations">
        <div *ngFor="let reservation of reservations" class="carte-reservation">
          <div class="entete-reservation">
            <span class="numero-reservation">{{ reservation.numeroReservation }}</span>
            <span class="statut" [ngClass]="'statut-' + reservation.statut.toLowerCase()">
              {{ getStatutLibelle(reservation.statut) }}
            </span>
          </div>
          
          <div class="details-reservation">
            <div class="info-ligne">
              <strong>Type:</strong> {{ getTypeLibelle(reservation.type) }}
            </div>
            
            <ng-container *ngIf="reservation.volId && volsById[reservation.volId] as vol">
              <div class="bloc-detail">
                <div class="sous-titre">Détail du vol</div>
                <div class="info-ligne"><strong>Vol:</strong> {{ vol.numeroVol }} ({{ vol.compagnie }})</div>
                <div class="info-ligne"><strong>Trajet:</strong> {{ vol.villeDepart }} → {{ vol.villeArrivee }}</div>
                <div class="info-ligne"><strong>Départ:</strong> {{ vol.dateDepart | date:'dd/MM/yyyy HH:mm' }}</div>
                <div class="info-ligne"><strong>Prix:</strong> {{ vol.prix }}€</div>
              </div>
            </ng-container>

            <ng-container *ngIf="reservation.hotelId && hotelsById[reservation.hotelId] as hotel">
              <div class="bloc-detail">
                <div class="sous-titre">Détail de l'hôtel</div>
                <div class="info-ligne"><strong>Nom:</strong> {{ hotel.nom }}</div>
                <div class="info-ligne"><strong>Adresse:</strong> {{ hotel.adresse }}, {{ hotel.ville }}</div>
                <div class="info-ligne"><strong>Étoiles:</strong> {{ hotel.etoiles }}</div>
                <div class="info-ligne"><strong>Prix/nuit:</strong> {{ hotel.prixParNuit }}€</div>
              </div>
            </ng-container>
            
            <div *ngIf="reservation.dateDebut" class="info-ligne">
              <strong>Du:</strong> {{ reservation.dateDebut | date:'dd/MM/yyyy' }}
              <strong>Au:</strong> {{ reservation.dateFin | date:'dd/MM/yyyy' }}
            </div>
            
            <div class="info-ligne">
              <strong>Nombre de personnes:</strong> {{ reservation.nombrePersonnes }}
            </div>
            
            <div *ngIf="reservation.nombreChambres" class="info-ligne">
              <strong>Nombre de chambres:</strong> {{ reservation.nombreChambres }}
            </div>
            
            <div class="info-ligne montant">
              <strong>Montant total:</strong> 
              <div class="montant-details">
                <span>{{ reservation.montantTotal }}€</span>
                <span class="montant-mad">{{ (reservation.montantTotal * 10.50).toFixed(2) }} MAD</span>
              </div>
            </div>
            
            <div class="info-ligne date-creation">
              Créée le: {{ reservation.dateCreation | date:'dd/MM/yyyy HH:mm' }}
            </div>
          </div>

          <div class="form-edition" *ngIf="editionReservationId === reservation.id">
            <div class="form-row">
              <label>
                <span>Nombre de personnes</span>
                <input type="number" min="1" [(ngModel)]="editionDraft.nombrePersonnes" />
              </label>
              <label *ngIf="reservation.hotelId">
                <span>Nombre de chambres</span>
                <input type="number" min="1" [(ngModel)]="editionDraft.nombreChambres" />
              </label>
            </div>
            <div class="form-row" *ngIf="reservation.dateDebut">
              <label>
                <span>Date début</span>
                <input type="date" [(ngModel)]="editionDraft.dateDebut" />
              </label>
              <label>
                <span>Date fin</span>
                <input type="date" [(ngModel)]="editionDraft.dateFin" />
              </label>
            </div>
            <div class="form-row">
              <label>
                <span>Statut</span>
                <select [(ngModel)]="editionDraft.statut">
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="CONFIRMEE">Confirmée</option>
                  <option value="ANNULEE">Annulée</option>
                  <option value="EXPIREE">Expirée</option>
                </select>
              </label>
            </div>
            <div class="actions-edition">
              <button class="btn btn-info" (click)="validerEdition()">Enregistrer</button>
              <button class="btn btn-secondaire" (click)="annulerEdition()">Annuler</button>
            </div>
          </div>

          <div class="actions-reservation" *ngIf="reservation.statut !== 'ANNULEE' && reservation.statut !== 'EXPIREE' && editionReservationId !== reservation.id">
            <button class="btn btn-info" (click)="demarrerEdition(reservation)">
              Modifier
            </button>
            <button class="btn btn-secondaire" (click)="annulerReservation(reservation.id)">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
            <button class="btn btn-info" (click)="modifierReservation(reservation)">
              Modifier
            </button>
            <button class="btn btn-secondaire" (click)="annulerReservation(reservation.id)">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conteneur {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .chargement {
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }

    .info-message {
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }

    .liste-reservations {
      display: grid;
      gap: 1.5rem;
    }

    .carte-reservation {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .entete-reservation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .numero-reservation {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .statut {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .statut-confirmee {
      background-color: #dcfce7;
      color: #166534;
    }

    .statut-en_attente {
      background-color: #fef3c7;
      color: #92400e;
    }

    .statut-annulee {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .statut-expiree {
      background-color: #f1f5f9;
      color: #475569;
    }

    .details-reservation {
      display: grid;
      gap: 0.75rem;
    }

    .info-ligne {
      display: flex;
      gap: 0.5rem;
      color: #475569;
    }

    .info-ligne strong {
      color: #1e293b;
      min-width: 150px;
    }

    .montant {
      align-items: flex-start;
    }

    .montant-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .montant-mad {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 400;
      font-size: 1.125rem;
      font-weight: 600;
      color: #0ea5e9;
      margin-top: 0.5rem;
    }

    .date-creation {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 0.5rem;
    }

    .actions-reservation {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
      text-align: right;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-info {
      background-color: #0ea5e9;
      color: white;
    }

    .btn-info:hover {
      background-color: #0284c7;
    }

    .btn-secondaire {
      background-color: #ef4444;
      color: white;
    }

    .btn-secondaire:hover {
      background-color: #dc2626;
    }

    .form-edition {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
      display: grid;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .form-row label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
      color: #475569;
    }

    .form-row input,
    .form-row select {
      padding: 0.6rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-weight: 500;
    }

    .actions-edition {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `]
})
export class ComposantReservations implements OnInit {
  reservations: any[] = [];
  volsById: Record<number, any> = {};
  hotelsById: Record<number, any> = {};
  chargement = false;
  infoMessage = '';

  constructor(
    private serviceReservation: ServiceReservation,
    private serviceVol: ServiceVol,
    private serviceHotel: ServiceHotel,
    private serviceAuth: ServiceAuth
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.infoMessage = '';

    const currentUser = this.serviceAuth.currentUserValue;
    // Backend auth response currently may not return user id; fallback to 1 to stay consistent
    // with the temporary reservation creation fallback used elsewhere.
    const utilisateurId = currentUser?.id ?? 1;
    if (!currentUser?.id) {
      this.infoMessage = 'Id utilisateur manquant, utilisation d\'un identifiant par défaut (1).';
    }

    this.serviceVol.obtenirTousLesVols().subscribe({
      next: (vols) => {
        vols.forEach(v => { if (v.id) { this.volsById[v.id] = v; } });
        this.serviceHotel.obtenirTousLesHotels().subscribe({
          next: (hotels) => {
            hotels.forEach(h => { if (h.id) { this.hotelsById[h.id] = h; } });
            this.serviceReservation.obtenirReservationsParUtilisateur(utilisateurId).subscribe({
              next: (data) => {
                this.reservations = data;
                this.chargement = false;
              },
              error: (error) => {
                console.error('Erreur lors du chargement des réservations:', error);
                this.chargement = false;
              }
            });
          },
          error: (error) => {
            console.error('Erreur chargement hôtels:', error);
            this.chargement = false;
          }
        });
      },
      error: (error) => {
        console.error('Erreur chargement vols:', error);
        this.chargement = false;
      }
    });
  }

  modifierReservation(reservation: any): void {
    this.demarrerEdition(reservation);
  }

  demarrerEdition(reservation: any): void {
    this.editionReservationId = reservation.id;
    this.editionDraft = { ...reservation };
  }

  annulerEdition(): void {
    this.editionReservationId = null;
    this.editionDraft = null;
  }

  validerEdition(): void {
    if (!this.editionDraft) { return; }

    if (!this.editionDraft.nombrePersonnes || this.editionDraft.nombrePersonnes < 1) {
      alert('Veuillez saisir un nombre de personnes valide');
      return;
    }

    if (this.editionDraft.hotelId && (!this.editionDraft.nombreChambres || this.editionDraft.nombreChambres < 1)) {
      alert('Veuillez saisir un nombre de chambres valide');
      return;
    }

    // Recalculer le montant basé sur les prix connus
    let montant = 0;
    if (this.editionDraft.volId && this.volsById[this.editionDraft.volId]) {
      montant += (this.volsById[this.editionDraft.volId].prix || 0) * this.editionDraft.nombrePersonnes;
    }
    if (this.editionDraft.hotelId && this.hotelsById[this.editionDraft.hotelId]) {
      montant += (this.hotelsById[this.editionDraft.hotelId].prixParNuit || 0) * (this.editionDraft.nombreChambres || 1);
    }
    if (montant === 0 && this.editionDraft.montantTotal) {
      montant = this.editionDraft.montantTotal; // fallback if prices not loaded
    }
    this.editionDraft.montantTotal = montant;

    this.serviceReservation.creerReservation(this.editionDraft).subscribe({
      next: () => {
        alert('Réservation modifiée avec succès!');
        this.annulerEdition();
        this.chargerDonnees();
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        alert('Erreur lors de la modification de la réservation');
      }
    });
  }

  annulerReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      this.serviceReservation.annulerReservation(id).subscribe({
        next: () => {
          alert('Réservation annulée avec succès!');
          this.chargerDonnees();
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation de la réservation:', error);
        }
      });
    }
  }

  getTypeLibelle(type: string): string {
    const types: any = {
      'VOL': 'Vol uniquement',
      'HOTEL': 'Hôtel uniquement',
      'VOL_HOTEL': 'Vol + Hôtel'
    };
    return types[type] || type;
  }

  getStatutLibelle(statut: string): string {
    const statuts: any = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'ANNULEE': 'Annulée',
      'EXPIREE': 'Expirée'
    };
    return statuts[statut] || statut;
  }
}
