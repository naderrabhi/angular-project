import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Equipements } from '../../models/equipements';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EquipementsService {
  private equipementsApiUrl: string = `${environment.apiUrl}/api/equipements`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all equipements
  getEquipements(): Observable<Equipements[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Equipements[]>(this.equipementsApiUrl, { headers });
  }

  // Get a equipement by ID
  getEquipementById(id: number): Observable<Equipements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.equipementsApiUrl}/${id}`;
    return this.http.get<Equipements>(url, { headers });
  }

  // Create a new equipement
  createEquipement(equipement: Equipements): Observable<Equipements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Equipements>(this.equipementsApiUrl, equipement, {
      headers,
    });
  }

  // Update an existing equipement
  updateEquipement(equipement: Equipements): Observable<Equipements> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.equipementsApiUrl}/${equipement.id}/modifier`;
    return this.http.put<Equipements>(url, equipement, { headers });
  }

  // Delete a equipement
  deleteEquipement(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.equipementsApiUrl}/${id}/supprimer`;
    return this.http.delete(url, { headers });
  }
}
