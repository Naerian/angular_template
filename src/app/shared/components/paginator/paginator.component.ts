import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationType, PaginatorPosition } from './models/paginator.entity';

/**
 * @name
 * neo-paginator
 * @description
 * Componente para crear un paginador
 * @example
 * <neo-paginator [pageSize]="10" [total]="100" (pageChange)="pageChange($event)"></neo-paginator>
 */
@Component({
  selector: 'neo-paginator',
  templateUrl: './paginator.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() pageSize: number = 0;
  @Input() total: number = 0;
  @Input() range: number = 2;
  @Input() position: PaginatorPosition = 'right';
  @Input() type: PaginationType = "rangenumber";
  @Input() showLastFirstBtns: boolean = true;
  @Input() showTotal: boolean = false;
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();

  currentPage: WritableSignal<number> = signal(1);
  currentsResults: WritableSignal<number> = signal(0);
  totalPages: WritableSignal<number> = signal(0);
  totalResults: WritableSignal<number> = signal(0);
  pages: WritableSignal<number[]> = signal([]);

  constructor() { }

  ngAfterContentInit(): void {
    this.setPagination();
    this.totalResults.set(this.getTotalPageResults());
  }

  /**
   * Obtiene el número de páginas totales en función del total de elementos y el número de elementos por página
   * @param {number} total
   * @param {number} pageSize
   * @returns {number}
   */
  public getTotalPages(total: number, pageSize: number): number {
    return Math.ceil(Math.max(total, 1) / Math.max(pageSize, 1));
  }

  /**
   * Obtiene la última página del paginador
   * @returns {number}
   */
  public getLastPage(): number {
    return this.totalPages();
  }

  /**
   * Establece la página actual. Útil para búsquedas locales, puesto que éstas vuelven a la página 1 y el buscador no lo sabe si no se le comunica
   * @param {number} page
   */
  public setCurrentPage(page: number) {
    this.currentPage.set(page);
  }

  /**
   * Establece el número de páginas a mostrar y actualiza el paginador, estableciendo la página actual a la primera
   */
  private setPagination() {
    this.totalPages.set(this.getTotalPages(this.total, this.pageSize));
    this.pages.set(this.pagesArray(this.totalPages()));
    if (this.currentPage() > this.pages().length) this.pageSelected(this.pages.length);
  }

  /**
   * Formamos un array con el número de páginas para poder usarlas en la vista
   * @param {number} pageCount
   * @returns {number}
   */
  private pagesArray(pageCount: number): number[] {
    const pageArray = [];

    let initPages = 1;
    let finishPages = this.totalPages();

    if (this.type === "rangenumber") {
      initPages = this.currentPage() - this.range || 1;
      finishPages = (this.currentPage() + this.range) - 1 || this.totalPages();
    }

    if (pageCount > 0) {
      for (let page = initPages; page <= finishPages + 1; page++) {
        if (this.isValidPage(page, this.getTotalPages(this.total, this.pageSize)))
          pageArray.push(page);
      }
    }

    return pageArray;
  }

  /**
   * Comprobamos si la página actual es válida o debe estar deshabilitada
   * @param {number} page
   * @param {number} totalPages
   * @returns {number}
   */
  isValidPage(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  /**
   * Función lanzada al seleccionar una página
   * @param {number} page
   * @param {Event} event
   */
  pageSelected(page: number, event?: Event) {
    event?.preventDefault();
    if (this.isValidPage(page, this.totalPages())) {
      this.currentPage.set(page);
      this.pages.set(this.pagesArray(this.totalPages()));
      this.pageChange.emit(page);
    }
    this.totalResults.set(this.getTotalPageResults());
  }

  /**
   * Función para obtener el total de resultados de la página actual
   * @returns {number}
   */
  getTotalPageResults(): number {
    return (this.pageSize * this.currentPage() > this.total ? this.total : this.pageSize * this.currentPage()) || 0;
  }
}
