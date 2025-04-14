// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  setTheme(theme: 'light-mode' | 'dark-mode') {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
  }
}
