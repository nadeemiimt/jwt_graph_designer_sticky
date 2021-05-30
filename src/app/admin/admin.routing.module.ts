import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiagramDesignerComponent } from './diagram-designer/diagram-designer.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import {
  AuthGuardService as AuthGuard
} from '../services/auth-guard.service';
import {
  RoleGuardService as RoleGuard
} from '../services/role-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin-dashboard'
    }, 
    component: DashboardComponent
  },
  {
    path: 'diagram-designer',
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin-diagram'
    },  
    component: DiagramDesignerComponent
  },
  {
    path: 'dynamic-form', 
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin-form'
    },  
    component: DynamicFormComponent
  },
  {
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full'
   // component: DashboardComponent
  },
  { 
    path: '**', 
    redirectTo: '', 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }