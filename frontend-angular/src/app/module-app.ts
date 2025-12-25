import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ComposantApp } from './composant-app';
import { ComposantAccueil } from './composants/accueil/composant-accueil';
import { ComposantListeVols } from './composants/vols/composant-liste-vols';
import { ComposantListeHotels } from './composants/hotels/composant-liste-hotels';
import { ComposantReservations } from './composants/reservations/composant-reservations';
import { ComposantLogin } from './composants/auth/composant-login';
import { ComposantRegister } from './composants/auth/composant-register';
import { ComposantDestinations } from './composants/destinations/composant-destinations';

const routes: Routes = [
  { path: '', component: ComposantAccueil },
  { path: 'login', component: ComposantLogin },
  { path: 'register', component: ComposantRegister },
  { path: 'destinations', component: ComposantDestinations },
  { path: 'vols', component: ComposantListeVols },
  { path: 'hotels', component: ComposantListeHotels },
  { path: 'reservations', component: ComposantReservations },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    ComposantApp,
    ComposantAccueil,
    ComposantDestinations,
    ComposantListeVols,
    ComposantListeHotels,
    ComposantReservations,
    ComposantLogin,
    ComposantRegister
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [ComposantApp]
})
export class ModuleApp { }
