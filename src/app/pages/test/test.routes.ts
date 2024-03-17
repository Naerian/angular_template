import { Route } from '@angular/router';

export const TEST_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./test.component').then((c) => c.TestComponent),
    children: []
  }
];
