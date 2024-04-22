import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AffectationDesOrdres } from '../../models/affectation-des-ordres';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AffectationDesOrdresService {
  private affectationDesOrdresApiUrl: string = `${environment.apiUrl}/api/affectation-des-ordres`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all affectations des ordres assignments
  getAffectationDesOrdres(): Observable<AffectationDesOrdres[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AffectationDesOrdres[]>(
      this.affectationDesOrdresApiUrl,
      { headers }
    );
  }

  // Get an affectation de ordre by ID
  getAffectationDeOrdreById(id: number): Observable<AffectationDesOrdres> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.affectationDesOrdresApiUrl}/${id}`;
    return this.http.get<AffectationDesOrdres>(url, { headers });
  }

  // Get affectation de ordre for a technician
  getAffectationDesOrdresByTechnicianId(
    technicianId: number
  ): Observable<AffectationDesOrdres[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.affectationDesOrdresApiUrl}/technicien/${technicianId}`;
    return this.http.get<AffectationDesOrdres[]>(url, { headers });
  }

  // Get affectation de ordre for a ordres de travail
  getAffectationDesOrdresByPeripheralId(
    ordresDeTravailId: number
  ): Observable<AffectationDesOrdres[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.affectationDesOrdresApiUrl}/ordres-de-travail/${ordresDeTravailId}`;
    return this.http.get<AffectationDesOrdres[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching assignments:', error);
        return of([]);
      })
    );
  }

  // Create a new affectation de ordre
  createAffectationDeOrdre(
    affectationDeOrdre: AffectationDesOrdres
  ): Observable<AffectationDesOrdres> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<AffectationDesOrdres>(
      this.affectationDesOrdresApiUrl,
      affectationDeOrdre,
      { headers }
    );
  }

  // Update an existing affectation de ordre
  updateAffectationDeOrdre(
    affectationDeOrdre: AffectationDesOrdres
  ): Observable<AffectationDesOrdres> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.affectationDesOrdresApiUrl}/${affectationDeOrdre.id}/modifier`;
    return this.http.put<AffectationDesOrdres>(url, affectationDeOrdre, {
      headers,
    });
  }

  // Delete an affectation de ordre
  deleteAffectationDeOrdre(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.affectationDesOrdresApiUrl}/${id}/supprimer`;
    return this.http.delete(url, { headers });
  }
}
