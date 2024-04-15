import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Peripheral } from '../../models/peripheral';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PeripheralService {
  private peripheralApiUrl: string = `${environment.apiUrl}/api/peripherals`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all peripherals
  getPeripherals(): Observable<Peripheral[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Peripheral[]>(this.peripheralApiUrl, { headers });
  }

  // Get a peripheral by ID
  getPeripheralById(id: number): Observable<Peripheral> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.peripheralApiUrl}/${id}`;
    return this.http.get<Peripheral>(url, { headers });
  }

  // Get peripherals by user ID (assuming your endpoint uses /users/:userId/peripherals)
  getPeripheralsByUserId(userId: number): Observable<Peripheral[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.peripheralApiUrl}/reported-by/${userId}`;
    return this.http.get<Peripheral[]>(url, { headers });
  }

  // Create a new peripheral (if supported by your API)
  createPeripheral(peripheral: Peripheral): Observable<Peripheral> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Peripheral>(this.peripheralApiUrl, peripheral, {
      headers,
    });
  }

  // Update an existing peripheral (if supported by your API)
  updatePeripheral(peripheral: Peripheral): Observable<Peripheral> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.peripheralApiUrl}/${peripheral.id}/edit`;
    return this.http.put<Peripheral>(url, peripheral, { headers });
  }

  // Delete a peripheral (if supported by your API)
  deletePeripheral(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.peripheralApiUrl}/${id}/delete`;
    return this.http.delete(url, { headers });
  }
}
