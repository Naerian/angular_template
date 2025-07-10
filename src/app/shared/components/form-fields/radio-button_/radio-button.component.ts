import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  WritableSignal,
  signal,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { InputSize } from '../models/form-field.model';

@Component({
  selector: 'neo-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild('contentWrapper', { static: true })
  contentWrapper!: ElementRef<HTMLDivElement>;

  @Input() checked = false;
  @Input() disabled = false;
  @Input() inputSize: InputSize = 'm';
  @Input() label?: string;
  @Input() name?: string;
  @Input() value?: string | number;

  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  @Input()
  set id(value: string) {
    if (value && value.trim() !== '') this._id.set(value);
    else this.createUniqueId();
  }
  get id(): string {
    return this._id();
  }

  _title: WritableSignal<string> = signal('');
  @Input()
  set title(value: string) {
    this._title.set(value);
  }
  get title(): string {
    return this._title();
  }

  // Variable para comprobar si el checkbox tiene contenido proyectado
  // Se usa para mostrar el contenido proyectado en el label del checkbox
  // Si no hay contenido proyectado, se usa el label o una cadena vacía
  // Se inicializa en false y se comprueba en ngAfterViewInit
  hasProjectedContent = false;

  @Output() changed = new EventEmitter<any>();

  private readonly _inputsUtilsService = inject(InputsUtilsService);

  onChange = (_: any) => {};
  onTouched = () => {};

  ngAfterViewInit() {
    this.createUniqueId();
    this.checkHasProjectedContent();
    this.computedTitle();
  }

  /**
   * Función para comprobar si el checkbox tiene contenido proyectado
   */
  checkHasProjectedContent() {
    const el = this.contentWrapper.nativeElement;
    this.hasProjectedContent =
      el.hasChildNodes() &&
      Array.from(el.childNodes).some(
        (node: any) =>
          node.nodeType === 1 ||
          (node.nodeType === 3 && node?.textContent?.trim()?.length > 0),
      );
  }

  /**
   * Función para crear un id único para el label del checkbox
   */
  createUniqueId() {
    if (this._id()) return; // Si ya existe, no generamos otro
    const uniqueId = this._inputsUtilsService.createUniqueId('checkbox_');
    this._id.set(uniqueId);
    this._labelId.set(`${uniqueId}__label`);
  }

  /**
   * Función para obtener el título del checkbox
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
   * Función para alternar el estado checked del radio button
   * Si el radio button está deshabilitado, no hace nada
   * Si no, alterna el estado checked y emite el evento changed
   * @param {Event} event - Evento del input
   */
  onInputChange(event: Event) {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.onChange(this.value);
    this.changed.emit(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.checked = value === this.value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
