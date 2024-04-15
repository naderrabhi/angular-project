import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // For API calls (if applicable)
import { UserRole } from './enums';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiUrl: string = `${environment.apiUrl}/api`;

  private userRoleSubject = new BehaviorSubject<string>('');
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  userRole$ = this.userRoleSubject.asObservable();
  isLoggedIn$ = this.loggedInSubject.asObservable();

  private userRole?: UserRole;
  private token?: string;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, credentials).pipe(
      map((response) => {
        this.userRoleSubject.next(response.user.role);
        this.setUserRole(response.user.role); // Set user role from response
        this.setToken(response.token);
        this.loggedInSubject.next(true);
        return response; // Return the entire response for potential use
      })
    );
  }

  register(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/register`, credentials);
  }

  logout(): void {
    this.userRoleSubject.next('');
    this.loggedInSubject.next(false);
    this.userRole = undefined;
    this.token = undefined;
    localStorage.removeItem('reloadExecuted');
    localStorage.removeItem('auth_token');
  }

  getUserRole(): UserRole | undefined {
    return this.userRole;
  }

  setUserRole(userRole: UserRole): void {
    this.userRole = userRole;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | undefined {
    return this.token || localStorage.getItem('auth_token')?.toString();
  }

  getCurrentUserInformation(token: string): Observable<any> {
    return this.http.get<any>(`${this.authApiUrl}/get-current-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
