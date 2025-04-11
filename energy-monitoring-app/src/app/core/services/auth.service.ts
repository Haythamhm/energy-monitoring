// src/app/core/services/auth.service.ts (updated)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  expiration: string;
  roles: string[];
  userId: string;
  userName: string;
  email: string;
}

export interface RegisterAdminModel {
  userName: string;
  email: string;
  fullName: string;
  password: string;
}

export interface RegisterEnterpriseModel {
  userName: string;
  email: string;
  fullName: string;
  password: string;
  enterpriseName: string;
  numberOfEmployees: number;
  contractDate: string;
  category: string;
}

export interface EnterpriseUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  enterpriseName: string;
  numberOfEmployees: number;
  contractDate: string;
  category: string;
  createdByAdminId?: string;
}

export interface ApiResponse {
  message: string;
}

export interface ClientStats {
  activeClients: number;
  inactiveClients: number;
  installingClients: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5256/api/Account';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  login(userName: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { userName, password }).pipe(
      tap(response => this.saveToken(response)),
      catchError(this.handleError)
    );
  }

  registerAdmin(model: RegisterAdminModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register-admin`, model).pipe(
      catchError(this.handleError)
    );
  }

  registerEnterprise(model: RegisterEnterpriseModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register-enterprise`, model).pipe(
      catchError(this.handleError)
    );
  }

  getClientStats(): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.apiUrl}/client-stats`);
  }
  

  getEnterpriseUsers(): Observable<EnterpriseUser[]> {
    return this.http.get<EnterpriseUser[]>(`${this.apiUrl}/enterprises`);
  }

  updateEnterpriseUser(userId: string, model: RegisterEnterpriseModel): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/enterprises/${userId}`, model).pipe(
      catchError(this.handleError)
    );
  }

  deleteEnterpriseUser(userId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/enterprises/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private saveToken(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('expiration', response.expiration);
    localStorage.setItem('roles', JSON.stringify(response.roles));
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userName', response.userName);
    localStorage.setItem('email', response.email);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('expiration');
    if (!expiration) return true;
    const expirationDate = new Date(expiration);
    return expirationDate <= new Date();
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  showMessage(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.error?.title || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.showMessage(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}