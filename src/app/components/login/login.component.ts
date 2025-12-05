import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { AppConstants } from '../../constants/app.constants';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  email = '';
  password = '';
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreDatabase: FirestoreDatabase,
    private theme: ThemeService
  ) { }

  autoLoginAsGuest() {
    this.email = 'guest@bingebuddy.ca';
    this.password = 'guest-password';
    this.onLogin();
  }

 onLogin() {
  const isGuest = this.email === 'guest@bingebuddy.ca' && this.password === 'guest-password';

  this.authService.login(this.email, this.password)
    .then(() => {
      console.log('Login successful');
      const userID = this.authService.currentUser?.uid!;

      if (isGuest) {
        // Skip database load or load default/mock data
        console.log('Guest login - skipping database load');
        // Optionally, set some default data here
        this.router.navigate(['/profile']);
        return;
      }

      // Normal user flow
      return Promise.all([
        this.firestoreDatabase.load(userID, AppConstants.CATEGORIES.WATCH_LIST),
        this.firestoreDatabase.load(userID, AppConstants.CATEGORIES.HISTORY)
      ]);
    })
    .then(() => {
      if (!isGuest) {
        console.log('Watchlist loaded:', this.firestoreDatabase.getLocalWatchList(this.authService.currentUser?.uid!));
        console.log('History loaded:', this.firestoreDatabase.getLocalHistory(this.authService.currentUser?.uid!));
        this.router.navigate(['/profile']);
      }
    })
    .catch((error) => {
      this.message = error.message.substring(10); // declutter message 
      console.error(error.message);
    });
}

  onRegister() {
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('Registration successful')
        this.message = 'Registration successful';
      })
      .catch(error => {
        this.message = error.message.substring(10);
        console.error(error)
      })
  }

  onThemeToggle(event: Event): void {
    this.theme.toggleTheme();
  }

}
