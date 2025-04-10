// src/app/core/services/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = this.authService.getRoles();
    const requiredRoles = route.data['roles'] as string[];
    console.log('AuthGuard - Roles:', roles, 'Required Roles:', requiredRoles);

    if (requiredRoles && !requiredRoles.some(role => roles.includes(role))) {
      this.authService.showMessage('Access denied. Insufficient permissions.', 'Close');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}