// src/app/shared/components/header/header.component.ts (updated)
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/core/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@app/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('200ms ease-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @Output() themeToggled = new EventEmitter<boolean>();
  isDarkMode = false;
  userRole = '';
  userName = '';
  notifications: { icon: string, message: string }[] = [
    { icon: 'message', message: 'New message received' },
    { icon: 'person_add', message: 'New client saved' },
    { icon: 'warning', message: 'System alert: Check server status' }
  ];
  showNotifications = false;
  showProfileMenu = false;
  clientStats = { activeClients: 0, inactiveClients: 0, installingClients: 0 };

  constructor(private authService: AuthService,
     private themeService: ThemeService)
      {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    this.userRole = roles.includes('SuperAdmin') ? 'SuperAdmin' : roles.includes('Admin') ? 'Admin' : 'Enterprise';
    this.userName = this.authService.getUserName() || 'User';
    this.isDarkMode = this.themeService.isDarkMode();
  }


  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    this.themeToggled.emit(this.isDarkMode)
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  logout(): void {
    this.authService.logout();
  }
}