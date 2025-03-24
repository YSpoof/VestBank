import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashFooterComponent } from '../../components/dashboard/footer/footer.component';
import { DashHeaderComponent } from '../../components/dashboard/header/header.component';

@Component({
  imports: [RouterModule, DashHeaderComponent, DashFooterComponent],
  template: `
    <dashboard-header />
    <router-outlet></router-outlet>
    <dashboard-footer />
  `,
})
export class DashboardLayoutComponent {}
