import {
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSize } from '../models/form-field.model';

/**
 * @name
 * neo-radio-button
 * @description
 * Componente individual de botón de radio que debe ser utilizado dentro de 'neo-radio-button-group'.
 * Emite un evento 'change' cuando es seleccionado.
 * @example
 * <neo-radio-button value="option1">Opción 1</neo-radio-button>
 */
@Component({
  selector: 'neo-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RadioButtonComponent {
  @ViewChild('contentWrapper', { static: true })
  contentWrapper!: ElementRef<HTMLDivElement>;

  /**
   * Valor único asociado a este radio button.
   */
  @Input({ required: true }) value: any;

  /**
   * Etiqueta o texto que se muestra junto al radio button.
   */
  @Input() label?: string;

  /**
   * Tamaño del input del radio button.
   */
  @Input() inputSize: InputSize = 'm';

  /**
   * Indica si el radio button está seleccionado.
   */
  _checked: WritableSignal<boolean> = signal(false);
  @Input() set checked(val: boolean) {
    this._checked.set(val);
  }
  get checked(): boolean {
    return this._checked();
  }

  /**
   * Nombre del grupo al que pertenece este radio button (establecido por el padre).
   */
  _name: WritableSignal<string> = signal('');
  @Input()
  set name(value: string) {
    this._name.set(value);
  }
  get name(): string {
    return this._name();
  }

  /**
   * Nombre del grupo al que pertenece este radio button (establecido por el padre).
   */
  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  @Input()
  set id(value: string) {
    this._id.set(value);
  }
  get id(): string {
    return this._id();
  }

  /**
   * Indica si el radio button está deshabilitado.
   */
  _disabled: WritableSignal<boolean> = signal(false);
  @Input() set disabled(val: boolean) {
    this._disabled.set(val);
  }
  get disabled(): boolean {
    return this._disabled();
  }

  /**
   * Título o tooltip que se muestra al pasar el mouse sobre el radio button.
   */
  _title: WritableSignal<string> = signal('');
  @Input()
  set title(value: string) {
    this._title.set(value);
  }
  get title(): string {
    return this._title();
  }

  // Variable para comprobar si el radiobutton tiene contenido proyectado
  // Se usa para mostrar el contenido proyectado en el label del radiobutton
  // Si no hay contenido proyectado, se usa el label o una cadena vacía
  // Se inicializa en false y se comprueba en ngAfterViewInit
  hasProjectedContent = false;

  /**
   * Emite el valor de este radio button cuando es seleccionado.
   */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    this.computedTitle();
  }

  /**
   * Función para obtener el título del radiobutton
   * Si se ha definido un título, se usa ese
   * Si no, se usa el contenido proyectado o el label
   */
  computedTitle() {
    setTimeout(() => {
      // Si ya se ha definido un título, lo usamos
      if (this._title()?.length > 0) return;

      // Si hay contenido proyectado, lo usamos como título,
      // si no, usamos el label o una cadena vacía
      const contentText =
        this.contentWrapper?.nativeElement?.textContent?.trim() || '';
      if (contentText?.length > 0) this._title.set(contentText);
      else this._title.set(this.label ?? '');
    });
  }

  /**
   * Maneja el evento de click en el radio button.
   */
  onClick(): void {
    if (this._disabled()) return;

    if (!this._checked()) {
      this._checked.set(true);
      this.change.emit(this.value);
    }
  }
}
