import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent }
  ];

  // @NgModule({
  //   imports: [RouterModule.forRoot(routes, { useHash: true })],
  //   exports: [RouterModule]
  // })
  // export class AppRoutesModule { }