import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { IColumnsFormat } from '@entities/table.entity';
import { TranslateModule } from '@ngx-translate/core';
import { EscapeKeyDirective } from '@shared/directives/escape-key.directive';
import { ButtonComponent } from '../button/button.component';
import { ButtonColor, ButtonSize } from '../button/models/button.entity';
import { SnakeTextToStringPipe } from '@shared/pipes/snake-text-to-string/snake-text-to-string.pipe';
import { CheckboxComponent } from '../form-fields/checkbox/checkbox.component';

/**
 * @name
 * neo-filter-columns-table
 * @description
 * Componente para crear un filtro de columnas en una tabla
 * @example
 * <neo-filter-columns-table [columns]="columnDefinitions" (columnsChange)="columnsChange($event)"></neo-filter-columns-table>
 */
@Component({
  selector: 'neo-filter-columns-table',
  standalone: true,
  imports: [CommonModule, A11yModule, OverlayModule, CheckboxComponent, EscapeKeyDirective, TranslateModule, ButtonComponent, SnakeTextToStringPipe],
  templateUrl: './filter-columns-table.component.html',
  styleUrl: './filter-columns-table.component.scss'
})
export class FilterColumnsTableComponent {

  /**
   * Input que recibe las columnas de la tabla
   */
  @Input() set columns(value: IColumnsFormat[]) {
    this._columns.set(JSON.parse(JSON.stringify(value))); // Clonamos el array para evitar problemas con la referencia
  }

  /**
   * Input que recibe el tamaño del icono del filtro
   */
  @Input() label: string = '';

  /**
   * Input que recibe el tamaño del icono del filtro, por defecto es 'xm'
   */
  @Input() size: ButtonSize = 'xm';

  /**
   * Input que recibe el color del icono del filtro, por defecto es 'primary'
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Input que recibe el color del icono del filtro, por defecto es 'true'
   */
  @Input() transparent: boolean = true;

  /**
   * Input que recibe el icono del filtro, por defecto es 'ri-table-line'
   */
  @Input() icon?: string = 'ri-table-line';

  /**
   * Output que emite las columnas seleccionadas
   */
  @Output() columnsChange: EventEmitter<IColumnsFormat[]> = new EventEmitter<IColumnsFormat[]>();

  _columns: WritableSignal<IColumnsFormat[]> = signal([]);
  isAllColumnsSelected: WritableSignal<boolean> = signal(false);
  isSomeColumnsSelected: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;
  isFiltersOpened: WritableSignal<boolean> = signal(false);

  constructor(
    scrollStrategyOptions: ScrollStrategyOptions
  ) {
    this.scrollStrategy = scrollStrategyOptions.close();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isAllSelected(), 100);
  }

  /**
   * Función para saber si todas las columnas están seleccionadas
   */
  isAllSelected() {
    const numVisibles = this._columns()?.filter(column => column.visible === true)?.length || 0;
    const numColumns = this._columns()?.length || 0;
    this.isAllColumnsSelected.set(numVisibles === numColumns);
    this.isSomeSelected();
  }

  /**
   * Función para saber si alguna columna está seleccionada
   */
  isSomeSelected() {
    const numVisibles = this._columns()?.filter(column => column.visible === true)?.length || 0;
    this.isSomeColumnsSelected.set(numVisibles > 0);
  }

  /**
   * Función para cambiar la visibilidad de una columna
   * @param {boolean} status
   * @param {number} index
   */
  changeVisibilityColumn(status: boolean, index: number) {
    this._columns()[index].visible = status;
    this.isAllSelected();
    this.columnsChange.emit(this._columns());
  }

  /**
   * Función para cambiar la visibilidad de todas las columnas
   * @param {boolean} status
   */
  changeVisibilityAllColumns(status: boolean) {
    this._columns.set(this._columns().map((column: IColumnsFormat) => {
      column.visible = status;
      return column;
    }));
    this.isAllSelected();
    this.columnsChange.emit(this._columns());
  }

  /**
   * Función para mostra / ocultar el overlay de los filtros
   * @param {Event} event
   */
  toggleOverlay(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.isAllSelected();
    this.isFiltersOpened.set(!this.isFiltersOpened());
  }

  /**
   * Funcion para cerrar el overlay de los filtros
   */
  closeFilters() {
    if (this.isFiltersOpened())
      this.isFiltersOpened.set(false);
  }

}
