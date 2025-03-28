import { afterNextRender, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  imports: [ReactiveFormsModule, RouterModule],
  template: ` @if (true) {
    <div class="flex flex-col items-center justify-center h-full">
      <p class="text-2xl font-bold mb-4">Acesse a VestBank!</p>

      <form [formGroup]="loginForm" class="flex flex-col gap-2 w-80">
        <input
          formControlName="email"
          type="email"
          class="border rounded p-2"
          placeholder="Email"
        />
        <input
          formControlName="password"
          type="password"
          class="border rounded p-2"
          placeholder="Password"
        />
        <button
          (click)="login()"
          class="transition-all cursor-pointer bg-green-700 hover:bg-green-800 active:scale-95 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <a
          routerLink="/dashboard/register"
          class="text-blue-500 hover:text-blue-700"
          >Não sou cliente</a
        >
        <a
          routerLink="/dashboard/reset"
          class="text-yellow-500 hover:text-yellow-700"
          >Esqueci a senha</a
        >
      </form>
    </div>
    }`,
})
export class LoginPageComponent {
  userSvc = inject(UserService);
  storageSvc = inject(StorageService);
  formBuilder = inject(FormBuilder);
  toast = inject(ToastService);
  router = inject(Router);
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(1)]],
  });

  login(token = false, silent = false) {
    if (token) {
      this.userSvc.onLogin(null).subscribe({
        next: (res) => {
          this.storageSvc.set('token', res.token);
          this.storageSvc.set('refresh', res.refreshToken);
          this.userSvc.authenticated.set(true);
          this.toast.showSuccess(`Bem-vindo(a), ${res.name}`);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          if (err.status === 0) return;
          this.userSvc.authenticated.set(false);
          if (silent) return;
          console.error(err.error.message);
          this.toast.showError(err.error.message);
        },
      });
      return;
    }
    if (!this.loginForm.valid) {
      if (this.loginForm.get('email')?.errors?.['required']) {
        this.toast.showError('Preencha o campo email.');
      }
      if (this.loginForm.get('email')?.errors?.['email']) {
        this.toast.showError('Email informado é inválido');
      }
      if (this.loginForm.get('password')?.errors?.['required']) {
        this.toast.showError('Preencha o campo senha.');
      }
      if (this.loginForm.get('password')?.errors?.['minlength']) {
        this.toast.showError('Senha deve ter no mínimo 6 caracteres');
      }
      return;
    }
    const email = this.loginForm.get('email')!.value as string;
    const password = this.loginForm.get('password')!.value as string;
    this.userSvc.onLogin({ email, password }).subscribe({
      next: (res) => {
        console.warn(res);
        this.storageSvc.set('token', res.token);
        this.storageSvc.set('refresh', res.refreshToken);
        this.userSvc.authenticated.set(true);
        this.toast.showSuccess(`Bem-vindo(a), ${res.name}`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 0) return;
        this.userSvc.authenticated.set(false);
        console.error(err.error.message);
        this.toast.showError(err.error.message);
      },
    });
  }

  constructor() {
    afterNextRender(() => {
      this.userSvc.$refreshNeeded.subscribe(() => {
        console.log('We have a new token, lets retry fetch');
      });
      this.login(true, true);
    });
  }
}
