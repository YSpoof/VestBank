import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-transfer',
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 w-full max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Transferir</h2>

      <form [formGroup]="form" (ngSubmit)="transfer()" class="space-y-4">
        <div class="space-y-2">
          <label for="pixi" class="block text-sm font-medium text-gray-700"
            >Chave PiXi</label
          >
          <input
            type="text"
            id="pixi"
            formControlName="pixi"
            placeholder="Coloque a chave PiXi do destinatário"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="space-y-2">
          <label for="amount" class="block text-sm font-medium text-gray-700"
            >Quantia</label
          >
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">F$</span>
            <input
              type="number"
              id="amount"
              formControlName="amount"
              min="1"
              placeholder="0.00"
              class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          [disabled]="form.invalid"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Transferir
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <p>All transfers are processed instantly and securely.</p>
      </div>
    </div>
  `,
})
export class DashboardTransferComponent {
  userSvc = inject(UserService);
  toastSvc = inject(ToastService);

  form = new FormBuilder().group({
    pixi: ['', [Validators.required, Validators.minLength(3)]],
    amount: [undefined, [Validators.required, Validators.min(1)]],
  });

  transfer() {
    if (this.form.invalid) {
      console.error('Invalid form data');
      this.toastSvc.showError('Invalid form data');
      return;
    }
    const { pixi, amount } = this.form.value;

    if (!pixi || !amount) {
      console.error('Invalid form data');
      this.toastSvc.showError('Invalid form data');
      return;
    }

    this.userSvc.doTransfer({ pixi: pixi.trim(), amount }).subscribe({
      next: (res) => {
        console.log('Transfer successful:', res);
        this.toastSvc.showSuccess(
          `Transferido R$${res.amount} para ${res.pixi}`
        );
        this.form.reset();
        this.userSvc.loadAccountData();
      },
      error: (err) => {
        console.error('Transfer failed:', err);
        this.toastSvc.showError(err.error.error);
      },
    });
  }
}
