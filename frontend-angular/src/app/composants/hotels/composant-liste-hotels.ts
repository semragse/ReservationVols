import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-hotels',
  template: `
    <div class="conteneur">
      <h2>Liste des Hôtels Disponibles</h2>
      <div class="carte">
        <p class="info-message">Fonctionnalité en cours de développement...</p>
      </div>
    </div>
  `,
  styles: [`
    .info-message {
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }
  `]
})
export class ComposantListeHotels implements OnInit {
  ngOnInit(): void {}
}
