import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OrdresDeTravail } from '../../models/ordres-de-travail';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrdresDeTravailService {
  private OrdresDeTravailApiUrl: string = `${environment.apiUrl}/api/ordres-de-travail`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all ordres de travail
  getOrdresDeTravail(): Observable<OrdresDeTravail[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrdresDeTravail[]>(this.OrdresDeTravailApiUrl, { headers });
  }

  // Get an ordres de travail by ID
  getOrdreDeTravailById(id: number): Observable<OrdresDeTravail> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.OrdresDeTravailApiUrl}/${id}`;
    return this.http.get<OrdresDeTravail>(url, { headers });
  }

  // Get ordres de travail by user ID
  getOrdresDeTravailByUserId(userId: number): Observable<OrdresDeTravail[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.OrdresDeTravailApiUrl}/rapporter-par/${userId}`;
    return this.http.get<OrdresDeTravail[]>(url, { headers });
  }

  // Create a new ordres de travail
  createOrdreDeTravail(ordreDeTravail: OrdresDeTravail): Observable<OrdresDeTravail> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<OrdresDeTravail>(this.OrdresDeTravailApiUrl, ordreDeTravail, {
      headers,
    });
  }

  // Update an existing ordres de travail
  updateOrdreDeTravail(ordreDeTravail: OrdresDeTravail): Observable<OrdresDeTravail> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.OrdresDeTravailApiUrl}/${ordreDeTravail.id}/modifier`;
    return this.http.put<OrdresDeTravail>(url, ordreDeTravail, { headers });
  }

  // Delete an ordres de travail
  deleteOrdreDeTravail(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.OrdresDeTravailApiUrl}/${id}/supprimer`;
    return this.http.delete(url, { headers });
  }
}
