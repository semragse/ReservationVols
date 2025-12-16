import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ComposantApp } from './composant-app';
import { ComposantAccueil } from './composants/accueil/composant-accueil';
import { ComposantListeVols } from './composants/vols/composant-liste-vols';
import { ComposantListeHotels } from './composants/hotels/composant-liste-hotels';
import { ComposantReservations } from './composants/reservations/composant-reservations';

const routes: Routes = [
  { path: '', component: ComposantAccueil },
  { path: 'vols', component: ComposantListeVols },
  { path: 'hotels', component: ComposantListeHotels },
  { path: 'reservations', component: ComposantReservations },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    ComposantApp,
    ComposantAccueil,
    ComposantListeVols,
    ComposantListeHotels,
    ComposantReservations
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [ComposantApp]
})
export class ModuleApp { }
