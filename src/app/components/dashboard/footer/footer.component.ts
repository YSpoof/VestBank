import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard-footer',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <footer class="flex justify-between p-4 bg-vb-black text-vb-secondary">
      <div class="text-sm">
        © {{ currentYear }} VestBank. Todos os direitos reservados.
      </div>
      <nav class="flex gap-4 text-sm">
        <a routerLink="/terms" routerLinkActive="text-vb-primary"
          >Termos de Uso</a
        >
        <a routerLink="/privacy" routerLinkActive="text-vb-primary"
          >Privacidade</a
        >
        <a routerLink="/help" routerLinkActive="text-vb-primary">Ajuda</a>
      </nav>
    </footer>
  `,
})
export class DashFooterComponent {
  currentYear: number = new Date().getFullYear();
}
