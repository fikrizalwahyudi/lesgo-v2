import { ModuleWithProviders, NgModule, Component } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { CartComponent } from './cart/cart.component';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';

import { AuthGuard } from '../../providers/auth.service';

import { TypographyWithParamsComponent } from './typographywithparams/typographywithparams.component';
import { OrderDetailComponent } from 'app/dashboard/order-detail/order-detail.component';

const routes: Routes =[
    // { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: DashboardComponent,
      children: [
        { path: 'user',           component: UserComponent },
        { path: 'typography',     component: TypographyComponent },
        { path: 'icons',          component: IconsComponent },
        { path: 'maps',           component: MapsComponent },
        { path: 'notifications',  component: NotificationsComponent },
        { path: 'upgrade',        component: UpgradeComponent },
        { path: 'user',           component: UserComponent },
        { path: 'tutorprofile',           component: TutorProfileComponent },
        { path: 'order',   
          children : [
            {
              path: '',
              component: OrderComponent
            },
            {
              path: 'detail',
              component: OrderDetailComponent
            }
          ]
        },
        { path: 'cart',           component: CartComponent },
        { path: 'home',           component: HomeComponent },
        { path: 'table',         
        children : [
          {
            path: '',
            component: TablesComponent
          },
          {
            path: 'typographywithparams',
           component: TypographyWithParamsComponent
          },
          {
            path: 'typographywithparams',
            component: TypographyWithParamsComponent
          }
        ]
        },
        { path: 'typography',     component: TypographyComponent },
        { path: 'icons',          component: IconsComponent },
        { path: 'maps',           component: MapsComponent },
        { path: 'notifications',  component: NotificationsComponent },
        { path: 'upgrade',        component: UpgradeComponent }
        // { path: 'typographywithparams',        component: TypographyWithParamsComponent },
        // { path: '',          redirectTo: 'login', pathMatch: 'full' }
      ],
      canActivate: [AuthGuard]
    }

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class DashboardRoutingModule { }
