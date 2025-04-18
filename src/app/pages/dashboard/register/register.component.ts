import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  imports: [ReactiveFormsModule, RouterModule],
  template: ` @if (true) {
    <div
      class="content-center place-items-center items-center justify-center h-screen bg-vb-black-secondary/90"
    >
      <div
        class="flex flex-col bg-stone-200 p-8 rounded-lg items-center justify-center shadow-lg shadow-orange-700 text-orange-700"
      >
        <p class="text-2xl font-bold mb-4">Abra a sua conta em segundos!</p>

        <form [formGroup]="registerForm" class="flex flex-col gap-4 w-80">
          <input
            formControlName="name"
            type="text"
            class="border rounded p-2 hover:border-orange-500 hover:text-orange-500"
            placeholder="Nome"
            required="true"
          />
          @if (this.registerForm.get('name')?.invalid &&
          (this.registerForm.get('name')?.dirty ||
          this.registerForm.get('name')?.touched)) { @if
          (this.registerForm.get('name')?.hasError('required')) {
          <div class="text-red-500 text-sm">O campo nome é obrigatório.</div>
          } @if (this.registerForm.get('name')?.hasError('minlength')) {
          <div class="text-red-500 text-sm">
            O campo nome precisa ter 3 caracteres no mínimo.
          </div>
          } }
          <input
            formControlName="email"
            type="email"
            class="border rounded p-2 hover:border-orange-500 hover:text-orange-500"
            placeholder="Email"
            required="true"
          />
          @if (this.registerForm.get('email')?.invalid &&
          (this.registerForm.get('email')?.dirty ||
          this.registerForm.get('email')?.touched)) { @if
          (this.registerForm.get('email')?.hasError('required')) {
          <div class="text-red-500 text-sm">O campo e-mail é obrigatório.</div>
          } @if (this.registerForm.get('email')?.hasError('email')) {
          <div class="text-red-500 text-sm">
            O campo e-mail precisa ter um formato válido (p. e.:
            meuemail&#64;exemplo.com).
          </div>
          } }
          <input
            formControlName="password"
            type="password"
            class="border rounded p-2 hover:border-orange-500 hover:text-orange-500"
            placeholder="Senha"
            required="true"
          />
          @if (this.registerForm.get('password')?.invalid &&
          (this.registerForm.get('password')?.dirty ||
          this.registerForm.get('password')?.touched)) { @if
          (this.registerForm.get('password')?.hasError('required')) {
          <div class="text-red-500 text-sm">O campo senha é obrigatório.</div>
          } @if (this.registerForm.get('password')?.hasError('minlength')) {
          <div class="text-red-500 text-sm">
            O campo senha precisa ter 3 caracteres no mínimo.
          </div>
          } }
          <button
            (click)="register()"
            class="transition-all cursor-pointer bg-blue-500 hover:bg-blue-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
          >
            Criar conta
          </button>
          <a
            routerLink="/dashboard/login"
            class="text-blue-500 hover:text-blue-700"
            >Já tem uma conta? Faça login.</a
          >
        </form>
      </div>
    </div>

    }`,
})
export class RegisterPageComponent {
  userSvc = inject(UserService);
  storageSvc = inject(StorageService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  toast = inject(ToastService);
  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  register() {
    if (!this.registerForm.valid) {
      if (this.registerForm.get('name')?.errors?.['required']) {
        this.toast.showError('Preencha o campo nome.');
      }
      if (this.registerForm.get('name')?.errors?.['minlength']) {
        this.toast.showError('Nome deve ter no mínimo 3 caracteres');
      }
      if (this.registerForm.get('email')?.errors?.['required']) {
        this.toast.showError('Preencha o campo email.');
      }
      if (this.registerForm.get('email')?.errors?.['email']) {
        this.toast.showError('Email informado é inválido');
      }
      if (this.registerForm.get('password')?.errors?.['required']) {
        this.toast.showError('Preencha o campo senha.');
      }
      if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.toast.showError('Senha deve ter no mínimo 3 caracteres');
      }
      return;
    }
    const name = this.registerForm.get('name')!.value as string;
    const email = this.registerForm.get('email')!.value as string;
    const password = this.registerForm.get('password')!.value as string;
    this.userSvc.onRegister({ name, email, password }).subscribe({
      next: (res) => {
        console.warn(res);
        this.storageSvc.set('token', res.token);
        this.storageSvc.set('refresh', res.refreshToken);
        this.userSvc.authenticated.set(true);
        this.toast.showSuccess(`Olá, ${res.name}`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 0) return;
        console.error(err.error.message);
        this.toast.showError(err.error.message);
      },
    });
  }

  constructor() {
    this.userSvc.doTokenLogin();
  }
}
