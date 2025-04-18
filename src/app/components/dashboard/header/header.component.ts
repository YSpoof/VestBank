import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard-header',
  imports: [RouterLink, RouterLinkActive],
  template: `<header
    class="flex flex-col md:flex-row justify-between gap-4 p-4 bg-vb-black text-vb-secondary"
    id="header"
  >
    <a
      routerLink="/dashboard"
      routerLinkActive="text-vb-primary mx-auto md:mx-0"
      id="headerTitle"
      >Painel</a
    >
    <nav class="flex flex-col items-center md:flex-row gap-4" id="headerNav">
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
