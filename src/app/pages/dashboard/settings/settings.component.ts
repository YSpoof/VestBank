import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  template: `
    <div class="flex flex-col items-center justify-center gap-4 h-screen">
      <div class="flex gap-4">
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
    </div>
  `,
})
export class SettingsPageComponent {
  userSvc = inject(UserService);
  toast = inject(ToastService);
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
