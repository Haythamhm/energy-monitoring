import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Load saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.setDarkMode(JSON.parse(savedTheme));
    } else {
      this.setDarkMode(false); // Default to light mode
    }
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}