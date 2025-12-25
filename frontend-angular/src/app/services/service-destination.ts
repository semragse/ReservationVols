import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Destination {
  id?: number;
  titre: string;
  ville: string;
  pays: string;
  description: string;
  image?: string;
  vols: any[];
  hotels: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceDestination {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  obtenirToutesLesDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`);
  }

  obtenirDestination(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/destinations/${id}`);
  }

  rechercherDestinations(criteres: any): Observable<Destination[]> {
    return this.http.post<Destination[]>(`${this.apiUrl}/destinations/rechercher`, criteres);
  }

  obtenirVolsPourDestination(destinationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/destinations/${destinationId}/vols`);
  }

  obtenirHotelsPourDestination(destinationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/destinations/${destinationId}/hotels`);
  }

  creerReservationDestination(reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations/destination`, reservation);
  }
}
