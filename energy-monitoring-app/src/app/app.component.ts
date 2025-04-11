import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Initialize theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.themeService.setDarkMode(JSON.parse(savedTheme));
    } else {
      this.themeService.setDarkMode(false); // Default to light mode
    }
  }
}