import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AccountResponse,
  DebugData,
  LoginRequest,
  RefreshResponse,
  RegisterRequest,
  TransferRequest,
  TransferResponse,
  TransfersResponse,
  UserResponse,
} from '../types/api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private storageClient = inject(StorageService);
  private router = inject(Router);
  public $refreshNeeded = new Subject<boolean>();
  public authenticated = signal<boolean>(false);
  public user = signal<UserResponse | null>(null);
  public account = signal<AccountResponse | null>(null);
  public transfers = signal<TransfersResponse>({ sent: [], received: [] });
  public allTransfers = signal<TransferResponse[]>([]);

  onLogin(credentials: LoginRequest | null) {
    return this.httpClient.post<UserResponse>('/api/login', credentials);
  }

  onRegister(credentials: RegisterRequest) {
    return this.httpClient.post<UserResponse>('/api/register', credentials);
  }

  doDelete() {
    return this.httpClient.delete<{ message: string }>('/api/delete');
  }

  doLogout() {
    this.account.set(null);
    this.user.set(null);
    this.httpClient.delete('/api/logout');
    this.authenticated.set(false);
    this.storageClient.clear();
    this.$refreshNeeded.next(true);
    this.router.navigate(['/']);
  }

  doTransfer(data: TransferRequest) {
    return this.httpClient.post<TransferResponse>('/api/transfer', {
      pixi: data.pixi,
      amount: data.amount,
    });
  }

  getNewToken() {
    const refreshToken = this.storageClient.get<string>('refresh');
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.httpClient
      .post<RefreshResponse>('/api/refresh', { refreshToken })
      .subscribe({
        next: (res) => {
          this.storageClient.set('token', res.token);
          this.$refreshNeeded.next(true);
          return;
        },
        error: () => {
          this.doLogout();
          this.router.navigate(['/login']);
          return;
        },
      });
  }

  loadAccountData() {
    this.httpClient.get<AccountResponse>('/api/account').subscribe({
      next: (res) => {
        this.account.set(res);
      },
      error: (_err) => {
        this.account.set(null);
        this.getNewToken();
      },
    });
    this.httpClient.get<TransfersResponse>('/api/transfers').subscribe({
      next: (res) => {
        this.transfers.set(res);
        this.allTransfers.set(
          [...res.sent, ...res.received].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
        );
      },
      error: (_err) => {
        this.transfers.set({ sent: [], received: [] });
        this.allTransfers.set([]);
        this.getNewToken();
      },
    });
  }

  getDebugData() {
    return this.httpClient.get<DebugData>('/api/debug');
  }

  addDebugMoney() {
    return this.httpClient.post<DebugData>('/api/debug', {});
  }
}
