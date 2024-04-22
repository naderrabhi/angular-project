import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Emplacements } from '../../models/emplacements';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmplacementsService {
  private emplacementsApiUrl: string = `${environment.apiUrl}/api/emplacements`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all emplacements
  getEmplacements(): Observable<Emplacements[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Emplacements[]>(this.emplacementsApiUrl, { headers });
  }

  // Get a emplacement by ID
  getEmplacementById(id: number): Observable<Emplacements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.emplacementsApiUrl}/${id}`;
    return this.http.get<Emplacements>(url, { headers });
  }

  // Create a new emplacement
  createEmplacement(emplacement: Emplacements): Observable<Emplacements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Emplacements>(this.emplacementsApiUrl, emplacement, {
      headers,
    });
  }

  // Update an existing emplacement
  updateEmplacement(emplacement: Emplacements): Observable<Emplacements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.emplacementsApiUrl}/${emplacement.id}/modifier`;
    return this.http.put<Emplacements>(url, emplacement, { headers });
  }

  // Delete a emplacement
  deleteEmplacement(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.emplacementsApiUrl}/${id}/supprimer`;
    return this.http.delete(url, { headers });
  }
}
