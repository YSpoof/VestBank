import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
import { moneyParser } from '../../../../utils/client/parsers';

@Component({
  selector: 'app-dashboard-transfer',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="p-6 m-4 w-full max-w-fit mx-auto bg-white rounded-lg shadow-md">
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
          <label
            for="amount"
            class="text-sm font-medium text-gray-700 flex justify-between"
            ><p>Quantia</p>
            <p>
              Saldo atual: {{ moneyParser(userSvc.account()!.balance) }}
            </p></label
          >
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">F$</span>
            <input
              type="number"
              id="amount"
              formControlName="amount"
              min="0.01"
              placeholder="0.00"
              class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          [disabled]="form.invalid"
          class="transition-all w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white  text-center text-base font-semibold shadow-md rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          Transferir
        </button>
      </form>

      @if (userSvc.allTransfers().length) {
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          Histórico de Transferências
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conta
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantia
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (transfer of userSvc.allTransfers(); track transfer.id) {
              <tr
                class="hover:bg-stone-200 cursor-pointer"
                [class.bg-green-50]="
                  transfer.fromPixi !== userSvc.account()?.pixi
                "
                (click)="
                  doNewTransfer(
                    transfer.fromPixi !== userSvc.account()?.pixi
                      ? transfer.fromPixi
                      : transfer.toPixi,
                    transfer.amount
                  )
                "
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transfer.createdAt | date : 'medium' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  @if (transfer.fromPixi === userSvc.account()?.pixi) {
                  <span
                    class="bg-red-100 text-red-800 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    Enviado
                  </span>
                  } @else {
                  <span
                    class="bg-green-100 text-green-800 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    Recebido
                  </span>
                  }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span>{{
                    transfer.fromPixi === userSvc.account()?.pixi
                      ? transfer.toPixi
                      : transfer.fromPixi
                  }}</span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  [class.text-red-600]="
                    transfer.fromPixi === userSvc.account()?.pixi
                  "
                  [class.text-green-600]="
                    transfer.fromPixi !== userSvc.account()?.pixi
                  "
                >
                  {{ moneyParser(transfer.amount) }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      }
    </div>
  `,
})
export class TransferPageComponent {
  userSvc = inject(UserService);
  toastSvc = inject(ToastService);
  moneyParser = moneyParser;

  form = new FormBuilder().group({
    pixi: ['', [Validators.required, Validators.minLength(3)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
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
          `Transferido ${moneyParser(res.amount)} para ${res.toPixi}`
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

  doNewTransfer(pixi: string, amount: number) {
    // Only pre-fill if it's a transfer to someone else
    if (pixi !== this.userSvc.account()?.pixi) {
      this.form.patchValue({ amount, pixi });
    }
  }
}
