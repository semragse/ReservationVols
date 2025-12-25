import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceReservation {
  private URL_API = 'http://localhost:8080/ms-reservation/api/reservations';

  constructor(private http: HttpClient) {}

  obtenirToutesReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_API);
  }

  obtenirReservationsParUtilisateur(utilisateurId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_API}/utilisateur/${utilisateurId}`);
  }

  creerReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.URL_API, reservation);
  }

  annulerReservation(id: number): Observable<any> {
    return this.http.put<any>(`${this.URL_API}/${id}/annuler`, {});
  }
}
