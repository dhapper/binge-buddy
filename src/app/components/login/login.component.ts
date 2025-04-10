import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('Login successful')
        this.message = 'Login successful';
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        this.message = 'Login failed: ' + error.message;
        console.error('Login failed:', error.message);
      })
  }

  onRegister() {
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('Registration successful')
        this.message = 'Registration successful';
      })
      .catch(error => {
        this.message = 'Registration failed: ' + error.message;
        console.error(error)
      })
  }

}
