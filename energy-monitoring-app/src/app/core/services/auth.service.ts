// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
}

export interface ApiResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5256/api/Account'; // Your backend URL

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Login
  login(userName: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { userName, password }).pipe(
      tap(response => this.saveToken(response))
    );
  }

  // Register Admin (SuperAdmin only)
  registerAdmin(model: RegisterAdminModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register-admin`, model);
  }

  // Register Enterprise (Admin only)
  registerEnterprise(model: RegisterEnterpriseModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register-enterprise`, model);
  }

  // Get all Enterprise users (Admin only)
  getEnterpriseUsers(): Observable<EnterpriseUser[]> {
    return this.http.get<EnterpriseUser[]>(`${this.apiUrl}/enterprises`);
  }

  // Update Enterprise user (Admin only)
  updateEnterpriseUser(userId: string, model: RegisterEnterpriseModel): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/enterprises/${userId}`, model);
  }

  // Delete Enterprise user (Admin only)
  deleteEnterpriseUser(userId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/enterprises/${userId}`);
  }

  // Store token and user data
  private saveToken(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('expiration', response.expiration);
    localStorage.setItem('roles', JSON.stringify(response.roles));
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userName', response.userName);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get roles
  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  // Get userId
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('expiration');
    if (!expiration) return true;
    const expirationDate = new Date(expiration);
    return expirationDate <= new Date();
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  // Logout
  logout(): void {
    localStorage.clear();
  }

  // Show snackbar message
  showMessage(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}