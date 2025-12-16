import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL_API = 'http://localhost:8082/api';

@Injectable({
  providedIn: 'root'
})
export class ServiceVol {
  private urlBase = `${URL_API}/vols`;

  constructor(private http: HttpClient) {}

  obtenirTousLesVols(): Observable<any[]> {
    return this.http.get<any[]>(this.urlBase);
  }

  obtenirVol(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlBase}/${id}`);
  }

  rechercherVols(villeDepart: string, villeArrivee: string, dateDebut: string, dateFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/recherche`, {
      params: { villeDepart, villeArrivee, dateDebut, dateFin }
    });
  }

  creerVol(vol: any): Observable<any> {
    return this.http.post<any>(this.urlBase, vol);
  }
}
