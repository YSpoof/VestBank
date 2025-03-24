import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard-header',
  imports: [RouterLink, RouterLinkActive],
  template: `<header
    class="flex justify-between p-4 bg-vb-black text-vb-secondary"
  >
    <a routerLink="/dashboard" routerLinkActive="text-vb-primary">Dashboard</a>
    <nav class="flex gap-4">
      <a routerLink="/dashboard/transfer" routerLinkActive="text-vb-primary"
        >Trasnferências</a
      >
      <a routerLink="/dashboard/settings" routerLinkActive="text-vb-primary"
        >Configurações</a
      >
      <a routerLink="/debug" target="_blank">DebugMode</a>
    </nav>
  </header>`,
})
export class DashHeaderComponent {}
