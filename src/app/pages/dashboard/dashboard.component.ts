import { afterNextRender, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>
      @if (this.userSvc.account() === null) {
      <p class="text-lg">Dados da conta não disponíveis...</p>
      } @else {
      <div>
        @if (!this.userSvc.account()!.suspended) {
        <p>
          Chave: {{ this.userSvc.account()!.pixi }} | Saldo: F$
          {{ this.userSvc.account()!.balance }}
        </p>
        } @else {
        <p>
          Conta suspensa com saldo: F$ {{ this.userSvc.account()!.balance }}
        </p>
        }
      </div>
      }

      <button
        (click)="logout()"
        class="transition-all cursor-pointer bg-yellow-500 hover:bg-yellow-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        (click)="delete()"
        class="transition-all cursor-pointer bg-red-500 hover:bg-red-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
      >
        Deletar conta
      </button>
    </div>
  `,
})
export class DashboardPageComponent {
  userSvc = inject(UserService);
  toast = inject(ToastService);

  constructor() {
    afterNextRender(() => {
      this.loadAccountData();
    });
  }

  loadAccountData() {
    this.userSvc.loadAccountData();
  }

  logout() {
    this.userSvc.doLogout();
    this.toast.showWarning('Logout efetuado com sucesso!');
  }

  delete() {
    if (
      confirm(
        'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.'
      )
    ) {
      this.userSvc.doDelete().subscribe({
        next: (res) => {
          this.userSvc.doLogout();
          this.toast.showSuccess(res.message);
        },
        error: (e) => {
          this.toast.showError(
            e.error ? e.error.message : 'Erro ao deletar conta!'
          );
        },
      });
    }
  }
}
