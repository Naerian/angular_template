import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged, filter } from 'rxjs';
import { BreadCrumbEntity } from './models/breadcrumb.entity';

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
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
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
    // Si no hay `routeConfig` disponible, significa que estamos en la ruta inicial
    let label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data['breadcrumb']
        : '';
    let path =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // Si la ruta es una ruta dinámica como ':id', la eliminamos
    const lastRoutePart = path?.split('/').pop() || '';
    const isDynamicRoute = lastRoutePart?.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart?.split(':')[1];
      path = path?.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    // En `routeConfig` la ruta completa no está disponible, por lo que la reconstruimos cada vez
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: BreadCrumbEntity = {
      label: label,
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
