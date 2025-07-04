import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'test',
        loadChildren: () => import('./../test/test.routes').then((r) => r.TEST_ROUTES),
        data: {
          breadcrumb: 'Test'
        },
      },
      {
        path: '', // Cuándo la URL en el panel de admin esté vacía, redirigimos a la ruta indicada en "redirectTo"
        redirectTo: 'test',
        pathMatch: 'full',
      },
    ]
  }
];
