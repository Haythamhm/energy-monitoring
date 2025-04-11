// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { RegisterEnterpriseComponent } from './pages/auth/register-enterprise/register-enterprise.component';
import { RegisterAdminComponent } from './pages/auth/register-admin/register-admin.component';
import { AccountManagementComponent } from './pages/accounts/account-management/account-management.component';
import { DashboardComponent } from './pages/auth/dashboard/dashboard.component';
import { MonitoringComponent } from './pages/monitoring/monitoring.component';
import { NetworkMonitoringComponent } from './pages/network-monitoring/network-monitoring.component';
import { ArchitectureComponent } from './pages/architecture/architecture.component';
import { IotComponent } from './pages/iot/iot.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ComparatorIaComponent } from './pages/comparator-ia/comparator-ia.component';
import { GeneratorReglesIaComponent } from './pages/generator-regles-ia/generator-regles-ia.component';

// 👇 importe le layout
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // ✅ ici on utilise LayoutComponent comme wrapper
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['Admin', 'SuperAdmin', 'Enterprise'] }
      },
      {
        path: 'monitoring',
        component: MonitoringComponent,
        data: { roles: ['Enterprise', 'Admin', 'SuperAdmin'] }
      },
      {
        path: 'network-monitoring',
        component: NetworkMonitoringComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'architecture',
        component: ArchitectureComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'iot',
        component: IotComponent,
        data: { roles: ['Admin', 'SuperAdmin', 'Enterprise'] }
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'comparator-ia',
        component: ComparatorIaComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'generator-regles-ia',
        component: GeneratorReglesIaComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'accounts',
        component: AccountManagementComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'register-enterprise',
        component: RegisterEnterpriseComponent,
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'register-admin',
        component: RegisterAdminComponent,
        data: { roles: ['SuperAdmin'] }
      },
    ]
  },

  // 👇 les routes extérieures comme login
  { path: 'login', component: LoginComponent },

  // redirections
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
