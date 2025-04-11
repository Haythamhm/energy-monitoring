// src/app/shared/components/sidebar/sidebar.component.ts (updated)
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/core/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('sidebarAnimation', [
      state('expanded', style({ width: '250px' })),
      state('collapsed', style({ width: '60px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ]),
    trigger('toggleIconAnimation', [
      state('expanded', style({ transform: 'rotate(0deg)' })),
      state('collapsed', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>(); // Renamed from toggleSidebar
  isCollapsed = false;
  isAdmin = false;
  isSuperAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    this.isAdmin = roles.includes('Admin');
    this.isSuperAdmin = roles.includes('SuperAdmin');
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed); // Updated to use sidebarToggled
  }
}