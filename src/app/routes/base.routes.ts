import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent() {
      return import('../layouts/default/default');
    },
    children: [
      {
        path: '',
        loadComponent() {
          return import('../pages/home-page/home-page');
        },
      },
      {
        path: 'about',
        loadComponent() {
          return import('../pages/about-page/about-page');
        },
      },
    ],
  },
];
