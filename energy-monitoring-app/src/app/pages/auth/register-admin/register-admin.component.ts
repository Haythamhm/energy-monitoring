// src/app/pages/auth/register-admin/register-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, RegisterAdminModel } from '../../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css'],
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
    trigger('cardAnimation', [
      transition(':enter', [
        animate('800ms ease-in-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.8)', offset: 0 }),
          style({ opacity: 0.5, transform: 'scale(1.05)', offset: 0.7 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('void => *', [
        style({ transform: 'scale(1)' }),
        animate('200ms ease-in-out', style({ transform: 'scale(1.05)' }))
      ]),
      transition('* => void', [
        animate('200ms ease-in-out', style({ transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class RegisterAdminComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation completed:', event.url);
      } else {
        console.log('Router event:', event);
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.authService.showMessage('Please fill in all required fields', 'Close');
      return;
    }

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

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}