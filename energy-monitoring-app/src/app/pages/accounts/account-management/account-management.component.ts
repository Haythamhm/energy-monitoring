import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { EditEnterpriseDialogComponent } from '../../auth/edit-enterprise-dialog/edit-enterprise-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';


interface EnterpriseUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  enterpriseName: string;
  numberOfEmployees: number;
  contractDate: string;
  category: string;
}

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  animations: [
    trigger('tableAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  users: EnterpriseUser[] = [];
  isAdmin = false;
  isSuperAdmin = false;
  isLoading = false;
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    this.isAdmin = roles.includes('Admin');
    this.isSuperAdmin = roles.includes('SuperAdmin');
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getEnterpriseUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showMessage('Failed to load users');
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
          next: () => {
            this.loadUsers();
            this.showMessage('User updated successfully');
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.showMessage('Failed to update user');
          }
        });
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteEnterpriseUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.showMessage('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showMessage('Failed to delete user');
        }
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}