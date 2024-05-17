import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, input, Input, InputSignal, Output, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { InputSize } from '../models/form-field.entity';

/**
 * @name
 * neo-input-password
 * @description
 * Componente para crear un campo de contraseña
 * @example
 * <neo-input-password [value]="'Texto'" [placeholder]="'Placeholder'" (enteredValue)="enteredValue($event)"></neo-input-password>
 */
@Component({
  selector: 'neo-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss', './../form-fields-settings.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule]
})
export class InputPasswordComponent implements ControlValueAccessor {

  @Input() autofocus?: boolean = false;
  @Input() readonly?: boolean = false;
  @Input() required: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() size?: number;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() inputSize: InputSize = 'm';
  hasErrors: InputSignal<boolean> = input<boolean>(false);

  /**
   * Input para crear un id único para el campo
   */
  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  @Input() set id(value: string) {
    this._id.set(value);
    this._labelId.set(`label_${value}`);
  }
  get id() {
    return this._id();
  }

  /**
   * Input para marcar el campo como deshabilitado
   */
  _disabled: WritableSignal<boolean> = signal(false);
  @Input() set disabled(status: boolean) {
    this._disabled.set(status);
  }

  get disabled() {
    return this._disabled();
  }

  /**
   * Input para introducir el valor del campo
   */
  _value: WritableSignal<string | null> = signal('');
  @Input() set value(value: string) {
    this._value.set(value);
  }

  get value(): string | null {
    return this._value();
  }

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  @Output() change = new EventEmitter<string>();

  show: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly _inputsUtilsService: InputsUtilsService,
  ) { }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (!this.id) {
      this._id.set(this._inputsUtilsService.createUniqueId(this.label || 'input-password'));
      this._labelId.set(`label_${this._id()}`);
    }
  }

  /**
   * Función del evento `input` del campo para obtener el valor introducido
   * @param {string} value
   */
  onInput(value: string) {
    this._value.set(value);
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * Función del evento `blur` del campo para marcar el campo como "touched"
   */
  onBlur() {
    this.onTouched();
  }

  /**
   * Función para mostrar u ocultar la contraseña al hacer click en el icono
   * @param {Event} event
   */
  togglePassword(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.show.set(!this.show());
  }

  /**
   * Función para mostrar la contraseña
   */
  showPassword() {
    this.show.set(true);
  }

  /**
   * Función para ocultar la contraseña
   */
  hidePassword() {
    this.show.set(false);
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any) {
    this._value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
