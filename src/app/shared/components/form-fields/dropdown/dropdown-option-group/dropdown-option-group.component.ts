import {
  Component,
  ContentChildren,
  QueryList,
  inject,
  signal,
  WritableSignal,
  input,
  InputSignal,
  AfterViewInit,
} from '@angular/core';
import { InputsUtilsService } from '../../services/inputs-utils.service';
import { DropdownOptionComponent } from '../dropdown-option/dropdown-option.component';

@Component({
  selector: 'neo-option-group',
  templateUrl: './dropdown-option-group.component.html',
})
export class DropdownOptionGroupComponent implements AfterViewInit {
  /**
   * Etiqueta del grupo de opciones.
   * @type {InputSignal<string>}
   * @required
   */
  label: InputSignal<string> = input.required();

  /**
   * Si el grupo está deshabilitado (deshabilita todas las opciones dentro).
   * @type {InputSignal<boolean>}
   */
  disabled: InputSignal<boolean> = input(false);

  @ContentChildren(DropdownOptionComponent)
  options!: QueryList<DropdownOptionComponent>;

  hasProjectedContent: WritableSignal<boolean> = signal(false); // Para el label

  private readonly _inputsUtilsService = inject(InputsUtilsService);

  // ID para accesibilidad si es necesario
  _id: WritableSignal<string> = signal('');

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del checkbox
   */
  createUniqueId() {
    if (this._id()) return; // Si ya existe, no generamos otro
    const uniqueId = this._inputsUtilsService.createUniqueId('option-group');
    this._id.set(uniqueId);
  }

  /**
   * Verifica si la opción está deshabilitada.
   */
  get isDisabled(): boolean {
    return this.disabled();
  }
}
