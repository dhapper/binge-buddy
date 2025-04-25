// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private isDarkMode: boolean = false;

  setTheme(theme: 'light-mode' | 'dark-mode') {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
  }
  
  toggleTheme() {
    // Flip the theme
    this.isDarkMode = !this.isDarkMode; // Toggle the boolean
    const newTheme = this.isDarkMode ? 'dark-mode' : 'light-mode'; // Determine new theme
    this.setTheme(newTheme); // Set the new theme
  }
}


