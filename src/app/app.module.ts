import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

import { FileSelectDirective } from 'ng2-file-upload';


import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardComponent} from './dashboard/dashboard.component';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { VerificationModule } from './verification/verification.module';




import { AuthGuard } from '../providers/auth.service';
import { UserService } from '../providers/user.service';
import { SmsService } from '../providers/sms.service';
import { ProductService } from '../providers/product.service';

import { AppComponent } from './app.component';


export const firebaseConfig = {
  apiKey: "AIzaSyBFKhA17tr8f2ki0agybmDZ2Pk_iYu2YLg",
  authDomain: "web-uat-1a4d8.firebaseapp.com",
  databaseURL: "https://web-uat-1a4d8.firebaseio.com",
  projectId: "web-uat-1a4d8",
  storageBucket: "web-uat-1a4d8.appspot.com",
  messagingSenderId: "732818088048"
   
};

@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    DashboardModule,
    LoginModule,
    RegistrationModule,
    VerificationModule
    
    
  ],
  providers: [AuthGuard, UserService, SmsService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
