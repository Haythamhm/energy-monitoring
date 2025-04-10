// src/app/shared/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {
  isOpen = true;
  roles: string[] = [];
  isEnterprise: boolean = false;

  constructor(private authService: AuthService) {
    this.roles = this.authService.getRoles();
    this.isEnterprise = this.roles.includes('Enterprise');
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}