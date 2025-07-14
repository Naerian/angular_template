import {
  Component,
  OnInit,
  ElementRef,
  inject,
  signal,
  WritableSignal,
  input,
  InputSignal,
  AfterViewInit,
} from '@angular/core';
import { InputsUtilsService } from '../../services/inputs-utils.service'; // Asume que tienes este servicio

@Component({
  selector: 'neo-option',
  templateUrl: './dropdown-option.component.html',
})
export class DropdownOptionComponent implements OnInit, AfterViewInit {
  /**
   * Valor único de la opción.
   * @type {InputSignal<any>}
   * @required
   */
  value: InputSignal<any> = input.required();

  /**
   * Etiqueta visible de la opción si no hay contenido proyectado.
   * @type {InputSignal<string | null>}
   */
  label: InputSignal<string | null> = input<string | null>(null);

  /**
   * Si la opción está deshabilitada.
   * @type {InputSignal<boolean>}
   */
  disabled: InputSignal<boolean> = input(false);

  // Propiedad interna para verificar si hay contenido proyectado
  hasProjectedContent: WritableSignal<boolean> = signal(false);

  private readonly _elementRef = inject(ElementRef);
  private readonly _inputsUtilsService = inject(InputsUtilsService);

  // ID para accesibilidad si es necesario
  _id: WritableSignal<string> = signal('');

  ngOnInit(): void {
    // Comprobar si hay contenido proyectado (innerHTML)
    this.hasProjectedContent.set(
      this._elementRef.nativeElement.innerHTML.trim().length > 0,
    );
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del checkbox
   */
  createUniqueId() {
    if (this._id()) return; // Si ya existe, no generamos otro
    const uniqueId = this._inputsUtilsService.createUniqueId('option');
    this._id.set(uniqueId);
  }

  /**
   * Obtiene el texto de la etiqueta a mostrar.
   * Prioriza el contenido proyectado, luego el input 'label'.
   */
  get displayLabel(): string {
    if (this.hasProjectedContent()) {
      return this._elementRef.nativeElement.textContent?.trim() || '';
    }
    return this.label() || '';
  }

  /**
   * Verifica si la opción está deshabilitada.
   */
  get isDisabled(): boolean {
    return this.disabled();
  }
}
