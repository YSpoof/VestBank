import { afterNextRender, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { moneyParser } from '../../../utils/client/parsers';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>
      @if (this.userSvc.account() === null) {
      <p class="text-lg">Dados da conta não disponíveis...</p>
      } @else {
      <div>
        @if (!this.userSvc.account()!.suspended) {
        <p>
          Chave: {{ this.userSvc.account()!.pixi }} | Saldo:
          {{ moneyParser(this.userSvc.account()!.balance) }}
        </p>
        } @else {
        <p>
          Conta suspensa com saldo:
          {{ moneyParser(this.userSvc.account()!.balance) }}
        </p>
        }
      </div>
      }
      <div>
        <a
          class="transition-all block px-4 py-2 bg-vb-secondary hover:bg-vb-tertiary hover:scale-105 active:scale-95"
          routerLink="transfer"
          >Fazer transferência</a
        >
      </div>
    </div>
  `,
})
export class DashboardPageComponent {
  userSvc = inject(UserService);
  toast = inject(ToastService);
  moneyParser = moneyParser;

  constructor() {
    afterNextRender(() => {
      this.loadAccountData();
    });
  }

  loadAccountData() {
    this.userSvc.loadAccountData();
  }
}
