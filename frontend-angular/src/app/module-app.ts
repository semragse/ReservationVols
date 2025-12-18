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

const routes: Routes = [
  { path: '', component: ComposantAccueil },
  { path: 'login', component: ComposantLogin },
  { path: 'register', component: ComposantRegister },
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
  providers: [],
  bootstrap: [ComposantApp]
})
export class ModuleApp { }
