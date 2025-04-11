import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService, ClientStats } from '@app/core/services/auth.service';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SidebarComponent } from '@app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole = '';
  clientStats: ClientStats = {
    activeClients: 0,
    inactiveClients: 0,
    installingClients: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRoles()[0];
    this.authService.getClientStats().subscribe({
      next: (stats) => this.clientStats = stats,
      error: (err) => console.error('Failed to load stats', err)
    });
  }
}