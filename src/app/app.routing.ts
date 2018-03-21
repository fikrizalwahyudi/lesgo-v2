import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerificationComponent } from './verification/verification.component';

import { AuthGuard } from '../providers/auth.service';

const appRoutes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'verification', component: VerificationComponent }
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
