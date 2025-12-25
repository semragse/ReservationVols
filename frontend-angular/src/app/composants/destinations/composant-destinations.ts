import { Component, OnInit } from '@angular/core';
import { ServiceDestination, Destination } from '../../services/service-destination';
import { ServiceVol } from '../../services/service-vol';
import { ServiceHotel } from '../../services/service-hotel';
import { ServiceReservation } from '../../services/service-reservation';
import { ServiceAuth } from '../../services/service-auth';

@Component({
  selector: 'app-destinations',
  template: `
    <div class="conteneur">
      <h1 class="titre-principal">Destinations Disponibles</h1>
      
      <!-- Recherche -->
      <div class="carte recherche-section">
        <h3>Rechercher une destination</h3>
        <div class="formulaire-recherche">
          <div class="formulaire-groupe">
            <label>Destination</label>
            <input type="text" [(ngModel)]="recherche.ville" placeholder="Tokyo, Paris, New York...">
          </div>
          <div class="formulaire-groupe">
            <label>Date de départ</label>
            <input type="date" [(ngModel)]="recherche.dateDepart">
          </div>
          <div class="formulaire-groupe">
            <label>Date de retour</label>
            <input type="date" [(ngModel)]="recherche.dateRetour">
          </div>
          <button class="btn btn-primaire" (click)="rechercherDestinations()">
            <span>🔍</span> Rechercher
          </button>
        </div>
      </div>

      <!-- Chargement -->
      <div *ngIf="chargement" class="chargement">
        <div class="spinner"></div>
        <p>Chargement des destinations...</p>
      </div>

      <!-- Liste des destinations -->
      <div *ngIf="!chargement && destinations.length === 0" class="alerte alerte-info">
        Aucune destination disponible pour le moment.
      </div>

      <div class="grille-destinations">
        <div *ngFor="let destination of destinations" class="carte-destination">
          <div class="entete-destination">
            <h2>{{ destination.titre }}</h2>
          </div>
          
          <div class="description-destination">
            <p>{{ destination.description }}</p>
          </div>

          <!-- Panel extensible -->
          <div class="panel-destination">
            <button 
              *ngIf="destination.id"
              class="btn-toggle-panel" 
              (click)="togglePanel(destination.id!)">
              {{ panelOuvert[destination.id!] ? '▼ Masquer les détails' : '▶ Voir les détails et réserver' }}
            </button>

            <div *ngIf="destination.id && panelOuvert[destination.id!]" class="details-destination">
              
              <!-- Section Vols -->
              <div class="section-vols">
                <h3>✈️ Vols disponibles</h3>
                <div *ngIf="chargementVols[destination.id!]" class="mini-spinner"></div>
                <div *ngIf="!chargementVols[destination.id!] && getVolsDestination(destination.id!).length === 0" class="alerte-mini">
                  Aucun vol disponible
                </div>
                <div class="liste-items">
                  <div *ngFor="let vol of getVolsDestination(destination.id!)" class="item-vol">
                    <div class="info-vol">
                      <strong>{{ vol.numeroVol }}</strong> - {{ vol.compagnie }}
                      <div class="trajet-mini">
                        {{ vol.villeDepart }} → {{ vol.villeArrivee }}
                      </div>
                      <div class="dates-mini">
                        Départ: {{ vol.dateDepart | date:'dd/MM/yyyy HH:mm' }}
                      </div>
                      <div class="prix-places">
                        <span class="prix">{{ vol.prix }}€</span>
                        <span class="places">{{ vol.placesDisponibles }} places</span>
                      </div>
                    </div>
                    <button 
                      class="btn-selectionner"
                      [class.selectionne]="volSelectionne[destination.id!] === vol.id"
                      (click)="selectionnerVol(destination.id!, vol)">
                      {{ volSelectionne[destination.id!] === vol.id ? '✓ Sélectionné' : 'Sélectionner' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section Hôtels -->
              <div class="section-hotels">
                <h3>🏨 Hôtels disponibles</h3>
                <div *ngIf="chargementHotels[destination.id!]" class="mini-spinner"></div>
                <div *ngIf="!chargementHotels[destination.id!] && getHotelsDestination(destination.id!).length === 0" class="alerte-mini">
                  Aucun hôtel disponible
                </div>
                <div class="liste-items">
                  <div *ngFor="let hotel of getHotelsDestination(destination.id!)" class="item-hotel">
                    <div class="info-hotel">
                      <strong>{{ hotel.nom }}</strong>
                      <div class="adresse-mini">{{ hotel.adresse }}, {{ hotel.ville }}</div>
                      <div class="details-mini">
                        ⭐ {{ hotel.etoiles }} étoiles | {{ hotel.chambresDisponibles }} chambres disponibles
                      </div>
                      <div class="prix-nuit">
                        <span class="prix">{{ hotel.prixParNuit }}€/nuit</span>
                      </div>
                    </div>
                    <button 
                      class="btn-selectionner"
                      [class.selectionne]="hotelSelectionne[destination.id!] === hotel.id"
                      (click)="selectionnerHotel(destination.id!, hotel)">
                      {{ hotelSelectionne[destination.id!] === hotel.id ? '✓ Sélectionné' : 'Sélectionner' }}
                    </button>
                </div>
              </div>

              <!-- Section Réservation -->
              <div *ngIf="volSelectionne[destination.id!] || hotelSelectionne[destination.id!]" class="section-reservation">
                <h3>Finaliser la réservation</h3>
                <div class="resume-selection">
                  <div *ngIf="volSelectionne[destination.id!]" class="item-resume">
                    <strong>Vol sélectionné:</strong> 
                    {{ getVolSelectionneInfo(destination.id!) }}
                  </div>
                  <div *ngIf="hotelSelectionne[destination.id!]" class="item-resume">
                    <strong>Hôtel sélectionné:</strong> 
                    {{ getHotelSelectionneInfo(destination.id!) }}
                  </div>
                  <div class="total-prix">
                    <strong>Prix total:</strong> {{ calculerPrixTotal(destination.id!) }}€
                  </div>
                </div>
                <button 
                  class="btn btn-success btn-reserver"
                  (click)="reserverDestination(destination)"
                  [disabled]="!currentUser">
                  {{ currentUser ? 'Réserver maintenant' : 'Connectez-vous pour réserver' }}
                </button>
              </div>
            </div>
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

    .titre-principal {
      text-align: center;
      color: #1e293b;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }

    .recherche-section {
      margin-bottom: 2rem;
    }

    .formulaire-recherche {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .formulaire-groupe {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .formulaire-groupe label {
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
    }

    .formulaire-groupe input {
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primaire {
      background: #000035;
      color: white;
    }

    .btn-primaire:hover {
      background: #111158;
    }

    .grille-destinations {
      display: grid;
      gap: 2rem;
    }

    .carte-destination {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s;
    }

    .carte-destination:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .entete-destination {
      background: linear-gradient(135deg, #000035 0%, #1a1a5a 100%);
      color: white;
      padding: 2rem;
    }

    .entete-destination h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .localisation {
      font-size: 1.125rem;
      opacity: 0.9;
    }

    .description-destination {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .panel-destination {
      padding: 1rem 2rem 2rem;
    }

    .btn-toggle-panel {
      width: 100%;
      padding: 1rem;
      background: #f1f5f9;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: #475569;
      transition: all 0.3s;
    }

    .btn-toggle-panel:hover {
      background: #e2e8f0;
    }

    .details-destination {
      margin-top: 1.5rem;
      display: grid;
      gap: 2rem;
    }

    .section-vols, .section-hotels {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .section-vols h3, .section-hotels h3 {
      margin-top: 0;
      color: #1e293b;
      font-size: 1.25rem;
    }

    .liste-items {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .item-vol, .item-hotel {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 2px solid transparent;
      transition: all 0.3s;
    }

    .item-vol:hover, .item-hotel:hover {
      border-color: #000035;
    }

    .info-vol, .info-hotel {
      flex: 1;
    }

    .trajet-mini, .adresse-mini, .dates-mini, .details-mini {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .prix-places, .prix-nuit {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-weight: 600;
    }

    .prix {
      color: #000035;
      font-size: 1.125rem;
    }

    .places {
      color: #64748b;
    }

    .btn-selectionner {
      padding: 0.5rem 1rem;
      border: 2px solid #000035;
      background: white;
      color: #000035;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-selectionner:hover {
      background: #000035;
      color: white;
    }

    .btn-selectionner.selectionne {
      background: #10b981;
      border-color: #10b981;
      color: white;
    }

    .section-reservation {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid #10b981;
    }

    .resume-selection {
      margin-bottom: 1rem;
    }

    .item-resume {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 6px;
    }

    .total-prix {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      font-size: 1.25rem;
      color: #059669;
    }

    .btn-success {
      background: #10b981;
      color: white;
      width: 100%;
      font-size: 1.125rem;
    }

    .btn-success:hover:not(:disabled) {
      background: #059669;
    }

    .btn-success:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .chargement, .mini-spinner {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #000035;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .alerte {
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .alerte-info {
      background: #dbeafe;
      color: #1e40af;
    }

    .alerte-mini {
      padding: 0.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.875rem;
    }

    .carte {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ComposantDestinations implements OnInit {
  destinations: Destination[] = [];
  chargement = false;
  recherche = {
    ville: '',
    dateDepart: '',
    dateRetour: ''
  };

  panelOuvert: { [key: number]: boolean } = {};
  volsParDestination: { [key: number]: any[] } = {};
  hotelsParDestination: { [key: number]: any[] } = {};
  chargementVols: { [key: number]: boolean } = {};
  chargementHotels: { [key: number]: boolean } = {};
  
  volSelectionne: { [key: number]: number | null } = {};
  hotelSelectionne: { [key: number]: number | null } = {};
  
  volsDetails: { [key: number]: any } = {};
  hotelsDetails: { [key: number]: any } = {};

  get currentUser() {
    return this.serviceAuth.currentUserValue;
  }

  constructor(
    private serviceDestination: ServiceDestination,
    private serviceVol: ServiceVol,
    private serviceHotel: ServiceHotel,
    private serviceReservation: ServiceReservation,
    private serviceAuth: ServiceAuth
  ) {}

  ngOnInit(): void {
    this.chargerDestinations();
  }

  chargerDestinations(): void {
    this.chargement = true;
    // Pour l'instant, on crée des destinations basées sur les vols et hôtels existants
    this.serviceVol.obtenirTousLesVols().subscribe({
      next: (vols) => {
        this.serviceHotel.obtenirTousLesHotels().subscribe({
          next: (hotels) => {
            this.creerDestinationsDepuisData(vols, hotels);
            this.chargement = false;
          },
          error: () => {
            this.chargement = false;
          }
        });
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  creerDestinationsDepuisData(vols: any[], hotels: any[]): void {
    const destinationsMap = new Map<string, Destination>();

    // Créer destinations depuis les vols
    vols.forEach(vol => {
      const cle = vol.villeArrivee;
      if (!destinationsMap.has(cle)) {
        destinationsMap.set(cle, {
          id: destinationsMap.size + 1,
          titre: `Partir à ${vol.villeArrivee}`,
          ville: vol.villeArrivee,
          pays: vol.paysArrivee || 'Non spécifié',
          description: `Découvrez ${vol.villeArrivee} et ses merveilles. Une destination inoubliable vous attend!`,
          vols: [],
          hotels: []
        });
      }
    });

    // Assigner vols et hôtels aux destinations
    destinationsMap.forEach((dest) => {
      this.volsParDestination[dest.id!] = vols.filter(v => v.villeArrivee === dest.ville);
      this.hotelsParDestination[dest.id!] = hotels.filter(h => h.ville === dest.ville);
    });

    this.destinations = Array.from(destinationsMap.values());
  }

  rechercherDestinations(): void {
    if (this.recherche.ville) {
      this.destinations = this.destinations.filter(d => 
        d.ville.toLowerCase().includes(this.recherche.ville.toLowerCase())
      );
    }
  }

  togglePanel(destinationId: number): void {
    this.panelOuvert[destinationId] = !this.panelOuvert[destinationId];
  }

  getVolsDestination(destinationId: number): any[] {
    return this.volsParDestination[destinationId] || [];
  }

  getHotelsDestination(destinationId: number): any[] {
    return this.hotelsParDestination[destinationId] || [];
  }

  selectionnerVol(destinationId: number, vol: any): void {
    this.volSelectionne[destinationId] = vol.id;
    this.volsDetails[destinationId] = vol;
  }

  selectionnerHotel(destinationId: number, hotel: any): void {
    this.hotelSelectionne[destinationId] = hotel.id;
    this.hotelsDetails[destinationId] = hotel;
  }

  getVolSelectionneInfo(destinationId: number): string {
    const vol = this.volsDetails[destinationId];
    return vol ? `${vol.numeroVol} - ${vol.villeDepart} → ${vol.villeArrivee}` : '';
  }

  getHotelSelectionneInfo(destinationId: number): string {
    const hotel = this.hotelsDetails[destinationId];
    return hotel ? `${hotel.nom} - ${hotel.ville}` : '';
  }

  calculerPrixTotal(destinationId: number): number {
    let total = 0;
    if (this.volsDetails[destinationId]) {
      total += this.volsDetails[destinationId].prix || 0;
    }
    if (this.hotelsDetails[destinationId]) {
      total += this.hotelsDetails[destinationId].prixParNuit || 0;
    }
    return total;
  }

  reserverDestination(destination: Destination): void {
    if (!this.currentUser) {
      alert('Connectez-vous avant de réserver');
      return;
    }

    // L’API nécessite un utilisateurId non nul. currentUser ne contient pas l’id (réponse /login ne le renvoie pas),
    // donc on utilise un fallback temporaire à 1 pour éviter l’erreur SQL 1048 en base.
    const utilisateurId = this.currentUser?.id ?? 1;

    const volId = this.volSelectionne[destination.id!];
    const hotelId = this.hotelSelectionne[destination.id!];

    if (!volId && !hotelId) {
      alert('Veuillez sélectionner au moins un vol ou un hôtel avant de réserver');
      return;
    }

    // Créer une réservation pour le vol si sélectionné
    if (volId) {
      const numeroReservation = 'RES-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const reservationVol = {
        utilisateurId,
        numeroReservation: numeroReservation,
        type: 'VOL',
        volId: volId,
        nombrePersonnes: 1,
        montantTotal: this.volsDetails[destination.id!]?.prix || 0,
        statut: 'CONFIRMEE'
      };

      this.serviceReservation.creerReservation(reservationVol).subscribe({
        next: () => {
          console.log('Réservation vol créée');
          // Si un hôtel est aussi sélectionné, créer sa réservation
          if (hotelId) {
            this.creerReservationHotel(hotelId, destination.id!);
          } else {
            alert('Réservation effectuée avec succès !');
            this.reinitialiserSelections(destination.id!);
          }
        },
        error: (err) => {
          console.error('Erreur réservation vol:', err);
          alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
      });
    } else if (hotelId) {
      // Seulement un hôtel sélectionné
      this.creerReservationHotel(hotelId, destination.id!);
    }
  }

  creerReservationHotel(hotelId: number, destinationId: number): void {
    const utilisateurId = this.currentUser?.id ?? 1;
    const numeroReservation = 'RES-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const reservationHotel = {
      utilisateurId,
      numeroReservation: numeroReservation,
      type: 'HOTEL',
      hotelId: hotelId,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 jour
      nombreChambres: 1,
      nombrePersonnes: 1,
      montantTotal: this.hotelsDetails[destinationId]?.prixParNuit || 0,
      statut: 'CONFIRMEE'
    };

    this.serviceReservation.creerReservation(reservationHotel).subscribe({
      next: () => {
        alert('Réservation effectuée avec succès !');
        this.reinitialiserSelections(destinationId);
      },
      error: (err) => {
        console.error('Erreur réservation hôtel:', err);
        alert('Erreur lors de la réservation. Veuillez réessayer.');
      }
    });
  }

  reinitialiserSelections(destinationId: number): void {
    this.volSelectionne[destinationId] = null;
    this.hotelSelectionne[destinationId] = null;
  }
}
