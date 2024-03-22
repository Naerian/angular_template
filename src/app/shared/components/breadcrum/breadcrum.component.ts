import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { BreadCrumbEntity } from './models/breadcrum.entity';
import { filter, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @name
 * neo-breadcrum
 * @description
 * Componente para la creación de un `breadcrumb` a partir de las rutas de la aplicación
 * @example
 * <neo-breadcrum></neo-breadcrum>
 */
@Component({
  selector: 'neo-breadcrum',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './breadcrum.component.html',
  styleUrl: './breadcrum.component.scss'
})
export class BreadcrumComponent {

  /**
   * Array de `breadcrumbs` que almacenará las rutas de la aplicación en las que se encuentre el usuario
   */
  public breadcrumbs: BreadCrumbEntity[]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    });
  }

  /**
   * Función para construir un `breadcrumb` a partir de las rutas de la aplicación en las que se encuentre el usuario
   * @param {ActivatedRoute} route
   * @param {string} url
   * @param {BreadCrumbEntity[]} breadcrumbs
   */
  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumbEntity[] = []): BreadCrumbEntity[] {

    // Si no hay `routeConfig` disponible, significa que estamos en la ruta inicial
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

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
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      // Si el siguiente es un hijo, seguimos construyendo el breadcrumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

}
