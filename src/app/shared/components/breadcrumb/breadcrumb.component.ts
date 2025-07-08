// src/app/shared/components/breadcrumb/breadcrumb.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; // Importamos Input
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
// import { TranslateModule } from '@ngx-translate/core'; // <-- ¡Eliminar esta importación!
import { distinctUntilChanged, filter } from 'rxjs';
import { BreadCrumbEntity } from './models/breadcrumb.model';

/**
 * @name
 * neo-breadcrumb
 * @description
 * Componente para la creación de un `breadcrumb` a partir de las rutas de la aplicación
 * @example
 * <neo-breadcrumb></neo-breadcrumb>
 */
@Component({
  selector: 'neo-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  /**
   * Texto para el enlace de "Home" del breadcrumb.
   */
  @Input() homeLabel: string = 'Home';

  /**
   * Array de `breadcrumbs` que almacenará las rutas de la aplicación en las que se encuentre el usuario
   */
  public breadcrumbs: BreadCrumbEntity[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  /**
   * Función para construir un `breadcrumb` a partir de las rutas de la aplicación en las que se encuentre el usuario
   * @param {ActivatedRoute} route
   * @param {string} url
   * @param {BreadCrumbEntity[]} breadcrumbs
   */
  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadCrumbEntity[] = [],
  ): BreadCrumbEntity[] {
    // Aquí, `label` debe ser el texto final a mostrar, no una clave de traducción.
    let label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data['breadcrumb'] // Esperamos que esto sea el texto final
        : '';
    let path =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // Si la ruta es una ruta dinámica como ':id', la eliminamos
    const lastRoutePart = path?.split('/').pop() || '';
    const isDynamicRoute = lastRoutePart?.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart?.split(':')[1];
      label = route.snapshot.params[paramName]; // Esto definitivamente ya es el VALOR, no una clave
      path = path?.replace(lastRoutePart, route.snapshot.params[paramName]);
    }

    // En `routeConfig` la ruta completa no está disponible, por lo que la reconstruimos cada vez
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: BreadCrumbEntity = {
      label: label, // La etiqueta ya es el texto final
      url: nextUrl,
    };

    // Solo añadiremos rutas cuya etiqueta no esté vacía
    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      // Si el siguiente es un hijo, seguimos construyendo el breadcrumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
