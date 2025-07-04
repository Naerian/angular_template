import { Routes } from '@angular/router';
import { NotFoundErrorComponent } from '@features/errors/not-found-error/not-found-error.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/main/main.routes').then((r) => r.MAIN_ROUTES),
  },
  {
    path: '**',
    component: NotFoundErrorComponent, // Cuándo la ruta no coincida con nada, mostraremos este componente
  },
];
