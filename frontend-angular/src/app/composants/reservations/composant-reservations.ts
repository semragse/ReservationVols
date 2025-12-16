import { Component, OnInit } from '@angular/core';
import { ServiceReservation } from '../../services/service-reservation';

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
            
            <div *ngIf="reservation.volId" class="info-ligne">
              <strong>Vol ID:</strong> {{ reservation.volId }}
            </div>
            
            <div *ngIf="reservation.hotelId" class="info-ligne">
              <strong>Hôtel ID:</strong> {{ reservation.hotelId }}
            </div>
            
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
          
          <div class="actions-reservation" *ngIf="reservation.statut !== 'ANNULEE' && reservation.statut !== 'EXPIREE'">
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
  `]
})
export class ComposantReservations implements OnInit {
  reservations: any[] = [];
  chargement = false;

  constructor(private serviceReservation: ServiceReservation) {}

  ngOnInit(): void {
    this.chargerReservations();
  }

  chargerReservations(): void {
    this.chargement = true;
    this.serviceReservation.obtenirToutesReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.chargement = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.chargement = false;
      }
    });
  }

  modifierReservation(reservation: any): void {
    const nouveauNombre = prompt(`Modifier le nombre de personnes (actuel: ${reservation.nombrePersonnes}):`, reservation.nombrePersonnes.toString());
    
    if (!nouveauNombre) {
      return;
    }

    const nombrePersonnes = parseInt(nouveauNombre, 10);
    
    if (isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      alert('Veuillez entrer un nombre valide');
      return;
    }

    // Recalculer le montant si c'est un vol
    const prixUnitaire = reservation.montantTotal / reservation.nombrePersonnes;
    const nouveauMontant = prixUnitaire * nombrePersonnes;

    const reservationModifiee = {
      ...reservation,
      nombrePersonnes: nombrePersonnes,
      montantTotal: nouveauMontant
    };

    this.serviceReservation.creerReservation(reservationModifiee).subscribe({
      next: () => {
        alert('Réservation modifiée avec succès!');
        this.chargerReservations();
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
          this.chargerReservations();
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
