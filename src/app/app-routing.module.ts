import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import {
  RoleGuardService as RoleGuard
} from './services/role-guard.service';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('src/app/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'account',
    loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    },
    loadChildren: () => import('src/app/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '**',
    loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
