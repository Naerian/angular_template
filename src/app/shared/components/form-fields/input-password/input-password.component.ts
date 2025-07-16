import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { ComponentSize } from '@shared/configs/component.model';
import { DEFAULT_SIZE } from '@shared/configs/component.consts';

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
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  /**
   * Input para establecer el tamaño del campo
   */
  _inputSize: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set inputSize(value: ComponentSize) {
    this._inputSize.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get inputSize(): ComponentSize {
    return this._inputSize();
  }

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

  /**
   * Evento que se emite cuando el valor del campo cambia
   */
  @Output() change = new EventEmitter<string>();

  /**
   * Evento que se emite cuando el campo pierde el foco
   */
  @Output() blur = new EventEmitter<void>();

  // Signal para mostrar u ocultar la contraseña
  show: WritableSignal<boolean> = signal(false);

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  protected readonly _translations: NeoUITranslations =
    inject(NEOUI_TRANSLATIONS);
  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    this._inputSize.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
  }

  ngOnInit(): void {
    this.setProperties();
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Método para establecer las propiedades por defecto del componente.
   */
  setProperties(): void {
    if (this.inputSize) this._inputSize.set(this.inputSize);
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (this._id()) return;
    this._id?.set(this._inputsUtilsService.createUniqueId('input-password'));
    this._labelId?.set(`label_${this._id()}`);
  }

  /**
   * Función para obtener el aria-describedby personalizado
   * que incluye el hint y el error del campo.
   * @return {string}
   */
  get ariaDescribedByCustom(): string {
    return this._inputsUtilsService.getAriaDescribedBy(this._id(), [
      'hint',
      'error',
    ]);
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
    this.blur.emit();
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
  onChange: any = () => {};
  onTouched: any = () => {};

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
