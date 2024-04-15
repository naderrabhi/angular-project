import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TechnicianAssignment } from '../../models/technician-assignment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TechnicianAssignmentService {
  private technicianAssignmentsApiUrl: string = `${environment.apiUrl}/api/technician-assignments`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all technician assignments
  getTechnicianAssignments(): Observable<TechnicianAssignment[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TechnicianAssignment[]>(
      this.technicianAssignmentsApiUrl,
      { headers }
    );
  }

  // Get a technician assignment by ID
  getTechnicianAssignmentById(id: number): Observable<TechnicianAssignment> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.technicianAssignmentsApiUrl}/${id}`;
    return this.http.get<TechnicianAssignment>(url, { headers });
  }

  // Get technician assignments for a technician (assuming endpoint uses /byTechnician/:technicianId)
  getAssignmentsByTechnicianId(
    technicianId: number
  ): Observable<TechnicianAssignment[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.technicianAssignmentsApiUrl}/technician/${technicianId}`;
    return this.http.get<TechnicianAssignment[]>(url, { headers });
  }

  // Get technician assignments for a peripheral (assuming endpoint uses /byPeripheral/:peripheralId)
  getAssignmentsByPeripheralId(
    peripheralId: number
  ): Observable<TechnicianAssignment[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.technicianAssignmentsApiUrl}/byPeripheral/${peripheralId}`;
    return this.http.get<TechnicianAssignment[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching assignments:', error);
        return of([]); // Handle errors, potentially return empty observable
      })
    );
  }

  // Create a new technician assignment (if supported by your API)
  createTechnicianAssignment(
    assignment: TechnicianAssignment
  ): Observable<TechnicianAssignment> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<TechnicianAssignment>(
      this.technicianAssignmentsApiUrl,
      assignment,
      { headers }
    );
  }

  // Update an existing technician assignment (if supported by your API)
  updateTechnicianAssignment(
    assignment: TechnicianAssignment
  ): Observable<TechnicianAssignment> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.technicianAssignmentsApiUrl}/${assignment.id}/edit`;
    return this.http.put<TechnicianAssignment>(url, assignment, { headers });
  }

  // Delete a technician assignment (if supported by your API)
  deleteTechnicianAssignment(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.technicianAssignmentsApiUrl}/${id}`;
    return this.http.delete(url, { headers });
  }
}
