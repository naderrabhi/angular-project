import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Users } from '../../models/users';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userApiUrl: string = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all users
  getUsers(): Observable<Users[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Users[]>(this.userApiUrl, { headers });
  }

  // Get a user by ID
  getUserById(id: number): Observable<Users> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.userApiUrl}/${id}`;
    return this.http.get<Users>(url, { headers });
  }

  // Create a new user (if supported by your API)
  createUser(user: Users): Observable<Users> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Users>(this.userApiUrl, user, { headers });
  }

  // Update an existing user (if supported by your API)
  updateUser(user: Users): Observable<Users> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.userApiUrl}/${user.id}/edit`;
    return this.http.put<Users>(url, user, { headers });
  }

  // Delete a user (if supported by your API)
  deleteUser(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.userApiUrl}/${id}/delete`;
    return this.http.delete(url, { headers });
  }
}
