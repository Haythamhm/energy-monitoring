// src/app/pages/auth/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService, EnterpriseUser } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditEnterpriseDialogComponent } from '../edit-enterprise-dialog/edit-enterprise-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  roles: string[] = [];
  isAdmin: boolean = false;
  isEnterprise: boolean = false;
  enterpriseUsers: EnterpriseUser[] = [];
  displayedColumns: string[] = [
    'userName',
    'email',
    'fullName',
    'enterpriseName',
    'numberOfEmployees',
    'contractDate',
    'category',
    'actions'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.roles = this.authService.getRoles();
    this.isAdmin = this.roles.includes('Admin');
    this.isEnterprise = this.roles.includes('Enterprise');
    if (this.isAdmin) {
      this.loadEnterpriseUsers();
    }
  }

  loadEnterpriseUsers(): void {
    this.authService.getEnterpriseUsers().subscribe({
      next: (users) => {
        this.enterpriseUsers = users;
      },
      error: (err) => {
        console.log('Error loading enterprise users:', err);
        this.authService.showMessage('Failed to load enterprise users', 'Close');
      }
    });
  }

  openEditDialog(user: EnterpriseUser): void {
    const dialogRef = this.dialog.open(EditEnterpriseDialogComponent, {
      width: '500px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.updateEnterpriseUser(user.id, result).subscribe({
          next: (response) => {
            this.authService.showMessage(response.message || 'Enterprise updated successfully', 'Close');
            this.loadEnterpriseUsers(); // Refresh the list
          },
          error: (err) => {
            console.log('Update enterprise error:', err);
            const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || err.error?.title || 'Failed to update enterprise';
            this.authService.showMessage(errorMessage, 'Close');
          }
        });
      }
    });
  }

  deleteEnterprise(userId: string): void {
    if (confirm('Are you sure you want to delete this enterprise user?')) {
      this.authService.deleteEnterpriseUser(userId).subscribe({
        next: (response) => {
          this.authService.showMessage(response.message || 'Enterprise deleted successfully', 'Close');
          this.loadEnterpriseUsers(); // Refresh the list
        },
        error: (err) => {
          console.log('Delete enterprise error:', err);
          const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || err.error?.title || 'Failed to delete enterprise';
          this.authService.showMessage(errorMessage, 'Close');
        }
      });
    }
  }
}