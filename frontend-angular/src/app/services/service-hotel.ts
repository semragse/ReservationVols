import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL_API = 'http://localhost:8083/api/hotels';

@Injectable({ providedIn: 'root' })
export class ServiceHotel {
  constructor(private http: HttpClient) {}

  obtenirTousLesHotels(): Observable<any[]> {
    return this.http.get<any[]>(URL_API);
  }

  rechercherParVille(ville: string): Observable<any[]> {
    return this.http.get<any[]>(`${URL_API}/ville/${encodeURIComponent(ville)}`);
  }

  rechercherParPays(pays: string): Observable<any[]> {
    return this.http.get<any[]>(`${URL_API}/pays/${encodeURIComponent(pays)}`);
  }

  rechercherParEtoiles(etoiles: number): Observable<any[]> {
    return this.http.get<any[]>(`${URL_API}/etoiles/${etoiles}`);
  }

  rechercherDisponibilite(nombreChambres: number): Observable<any[]> {
    const params = new HttpParams().set('nombreChambres', nombreChambres);
    return this.http.get<any[]>(`${URL_API}/disponibles`, { params });
  }
}
