import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DebugPlaceholderComponent } from '../../components/debug/placeholder/placeholder.component';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { DebugData } from '../../types/api';

@Component({
  imports: [RouterLink, DebugPlaceholderComponent],
  template: `
    <a
      routerLink="/"
      class="block cursor-pointer px-4 py-2 w-full bg-vb-tertiary hover:bg-vb-secondary text-center"
      >Go home</a
    >
    @if (!isLoading()) {

    <div class="p-4">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Users</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left">Name</th>
                <th class="px-6 py-3 text-left">Email</th>
                <th class="px-6 py-3 text-left">ID</th>
                <th class="px-6 py-3 text-left">Created At</th>
                <th class="px-6 py-3 text-left">Has Refresh Token</th>
              </tr>
            </thead>
            <tbody>
              @for(user of this.debugData()?.users; track user.id) {
              <tr class="border-t border-gray-300">
                <td class="px-6 py-4">{{ user.name }}</td>
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">{{ user.id }}</td>
                <td class="px-6 py-4">{{ user.createdAt }}</td>
                <td
                  (click)="copyRefreshToken(user.refreshToken ?? '')"
                  class="px-6 py-4 cursor-copy"
                >
                  {{ user.refreshToken ? 'Yes' : 'No' }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4">Accounts</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left">Account ID</th>
                <th class="px-6 py-3 text-left">Owner</th>
                <th class="px-6 py-3 text-left">PiXi Key</th>
                <th class="px-6 py-3 text-left">Balance</th>
                <th class="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              @for(account of this.debugData()?.accounts; track account.id) {
              <tr class="border-t border-gray-300">
                <td class="px-6 py-4">{{ account.id }}</td>
                <td class="px-6 py-4">
                  {{ getAccountOwnerName(account.clientId) }}
                </td>
                <td class="px-6 py-4">{{ account.pixi }}</td>
                <td class="px-6 py-4">{{ account.balance }}</td>
                <td class="px-6 py-4">
                  {{ account.suspended ? 'Suspended' : 'Active' }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    } @else {
    <app-debug-placeholder />
    }
    <button
      (click)="refreshData()"
      class="block cursor-pointer px-4 py-2 w-full bg-vb-tertiary hover:bg-vb-secondary"
    >
      Refresh Data
    </button>

    <button
      (click)="addMoney()"
      class="block cursor-pointer px-4 py-2 w-full bg-vb-primary hover:bg-vb-secondary"
    >
      Add F$10 to all accounts
    </button>
  `,
})
export class DebugComponent {
  userSvc = inject(UserService);
  toastSvc = inject(ToastService);
  isLoading = signal(true);
  debugData = signal<DebugData | null>(null);

  copyRefreshToken(token: string) {
    if (!token) {
      this.toastSvc.showError('User does not have a refresh token');
      return;
    }
    navigator.clipboard.writeText(token);
    this.toastSvc.showSuccess('Refresh token copied to clipboard');
  }

  getAccountOwnerName(accountOwnerId: string) {
    return this.debugData()?.users?.find((user) => user.id === accountOwnerId)
      ?.name;
  }

  refreshData() {
    const timeout = setTimeout(() => {
      this.isLoading.set(true);
    }, 300);
    this.userSvc.getDebugData().subscribe({
      next: (data) => {
        this.debugData.set(data);
        this.isLoading.set(false);
        clearTimeout(timeout);
        this.toastSvc.showSuccess('Debug data fetched');
      },
      error: () => {
        this.toastSvc.showError('Failed to fetch debug data');
        this.isLoading.set(false);
        clearTimeout(timeout);
        this.toastSvc.showError('Failed to fetch debug data');
      },
    });
  }

  addMoney() {
    this.userSvc.addDebugMoney().subscribe({
      next: (res) => {
        this.refreshData();
        this.toastSvc.showSuccess(res.message ?? 'Money added successfully');
      },
      error: () => {
        this.toastSvc.showError('Failed to add money');
      },
    });
  }

  ngOnInit() {
    this.refreshData();
  }
}
