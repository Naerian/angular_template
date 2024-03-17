import { Routes } from '@angular/router';
import { NotFoundErrorComponent } from '@pages/errors/not-found-error/not-found-error.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main/main.routes').then((r) => r.MAIN_ROUTES),
  },
  {
    path: '**',
    component: NotFoundErrorComponent, // Cuándo la ruta no coincida con nada, mostraremos este componente
  }
];
