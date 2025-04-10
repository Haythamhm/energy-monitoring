// src/app/pages/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, RegisterAdminModel, RegisterEnterpriseModel } from '../../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isAdmin: boolean = false;
  roles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      enterpriseName: [''],
      numberOfEmployees: [0],
      contractDate: [''],
      category: ['']
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation completed:', event.url);
      } else {
        console.log('Router event:', event);
      }
    });
  }

  ngOnInit(): void {
    this.roles = this.authService.getRoles();
    this.isAdmin = this.roles.includes('Admin');

    if (this.isAdmin) {
      this.registerForm.get('enterpriseName')?.setValidators(Validators.required);
      this.registerForm.get('numberOfEmployees')?.setValidators(Validators.required);
      this.registerForm.get('contractDate')?.setValidators(Validators.required);
      this.registerForm.get('category')?.setValidators(Validators.required);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.authService.showMessage('Please fill in all required fields', 'Close');
      return;
    }

    if (this.isAdmin) {
      const enterpriseModel: RegisterEnterpriseModel = this.registerForm.value;
      this.authService.registerEnterprise(enterpriseModel).subscribe({
        next: (response) => {
          console.log('Enterprise registration response:', response);
          this.authService.showMessage(response.message || 'Enterprise registered successfully', 'Close');
          this.router.navigate(['/dashboard']).then(success => {
            console.log('Navigation to /dashboard successful:', success);
          }).catch(err => {
            console.error('Navigation to /dashboard failed:', err);
          });
        },
        error: (err) => {
          console.log('Enterprise registration error:', err);
          const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || err.error?.title || 'Failed to register enterprise';
          this.authService.showMessage(errorMessage, 'Close');
        }
      });
    } else {
      const adminModel: RegisterAdminModel = {
        userName: this.registerForm.value.userName,
        email: this.registerForm.value.email,
        fullName: this.registerForm.value.fullName,
        password: this.registerForm.value.password
      };
      this.authService.registerAdmin(adminModel).subscribe({
        next: (response) => {
          console.log('Admin registration response:', response);
          this.authService.showMessage(response.message || 'Admin registered successfully', 'Close');
          this.router.navigate(['/dashboard']).then(success => {
            console.log('Navigation to /dashboard successful:', success);
          }).catch(err => {
            console.error('Navigation to /dashboard failed:', err);
          });
        },
        error: (err) => {
          console.log('Admin registration error:', err);
          const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || err.error?.title || 'Failed to register admin';
          this.authService.showMessage(errorMessage, 'Close');
        }
      });
    }
  }
}