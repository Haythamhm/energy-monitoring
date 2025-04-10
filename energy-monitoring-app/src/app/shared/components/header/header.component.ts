// src/app/shared/components/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule // Add CommonModule to imports
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.userName = localStorage.getItem('userName');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.authService.showMessage('Logged out successfully', 'Close');
  }
}