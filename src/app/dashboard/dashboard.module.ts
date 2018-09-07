import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { DashboardRoutingModule } from './dashboard.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { LbdModule } from './lbd/lbd.module';

import { AuthGuard } from '../../providers/auth.service';

import { DashboardComponent } from './dashboard.component';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TypographyWithParamsComponent } from './typographywithparams/typographywithparams.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';

import { RegistrationModule } from '../registration/registration.module';

import {MyDatePickerModule} from 'mydatepicker';
// import {SelectModule} from 'ng2-select';
// import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {SelectModule} from 'ng-select';

import { ImageCropperModule } from 'ng2-img-cropper';

import { AgmCoreModule } from '@agm/core';

// import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

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
    DashboardComponent,
    HomeComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    TypographyWithParamsComponent,
    LoginComponent,
    OrderComponent,
    OrderDetailComponent,
    CartComponent,
    TutorProfileComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    DashboardRoutingModule,
    LbdModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkJlWv1jF6qlZvbn8vQbtiSQckPFjzQ-w',
      libraries: ["places"]
    }),
    MyDatePickerModule,
    SelectModule,
    RegistrationModule,
    ImageCropperModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
