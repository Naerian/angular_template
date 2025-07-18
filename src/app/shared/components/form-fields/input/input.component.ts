import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import {
  InputAutocomplete,
  InputMode,
  InputType,
} from '../models/form-field.model';
import { ShowClearFieldDirective } from '@shared/directives/show-clear-field.directive';
import { ComponentSize } from '@shared/configs/component.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { DEFAULT_SIZE } from '@shared/configs/component.consts';

/**
 * @name
 * neo-input
 * @description
 * Componente para crear un campo de texto
 * @example
 * <neo-input [value]="'Texto'" [type]="'text'" [placeholder]="'Placeholder'" (change)="change($event)"></neo-input>
 * <neo-input [value]="'Texto'" [type]="'number'" [placeholder]="'Placeholder'" formControlName="input_name"></neo-input>
 */
@Component({
  selector: 'neo-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, ShowClearFieldDirective],
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  // Permite crear un "ng-template" para añadir un prefijo o sufijo al input
  @ContentChild('prefix') prefixTpl?: TemplateRef<any>;
  @ContentChild('suffix') suffixTpl?: TemplateRef<any>;

  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input({ transform: booleanAttribute }) showClear: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() step?: number = 1; // Para inputs de tipo number, define el incremento/decremento
  @Input() placeholder: string = '';
  @Input() autocapitalize: 'off' | 'on' = 'off'; // Define si se debe autocapitalizar el texto
  @Input() spellcheck: boolean = false; // Define si se debe revisar la ortografía del texto
  @Input() type: InputType = 'text';
  @Input() autocomplete: InputAutocomplete = 'off';
  @Input() pattern?: string;
  @Input() inputmode?: InputMode; // Define el modo de entrada del teclado en dispositivos móviles
  @Input() size?: number;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input('aria-label') ariaLabel!: string;
  @Input('aria-labelledby') ariaLabelledBy!: string;
  @Input('aria-owns') ariaOwns!: string;
  @Input('aria-describedby') ariaDescribedBy!: string;
  @Input('aria-autocomplete') ariaAutocomplete: 'none' | 'inline' | 'list' =
    'none';

  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() titlePrefix!: string;
  @Input() titleSuffix!: string;
  @Input({ transform: booleanAttribute }) bgPrefix?: boolean = false;
  @Input({ transform: booleanAttribute }) bgSuffix?: boolean = false;
  @Input({ transform: booleanAttribute }) prefixInside = false;
  @Input({ transform: booleanAttribute }) suffixInside = false;
  @Input({ transform: booleanAttribute }) prefixClickable = false;
  @Input({ transform: booleanAttribute }) suffixClickable = false;

  /**
   * Tamaño del input del dropdown.
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

  @Output() change = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() onClear = new EventEmitter<void>();
  @Output() prefixClick = new EventEmitter<void>();
  @Output() suffixClick = new EventEmitter<void>();

  focused = false;

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    // Inicializamos el tamaño del input con el valor por defecto de la configuración global
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
    this._id?.set(this._inputsUtilsService.createUniqueId('input'));
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
   * Función para limpiar el campo de texto
   */
  clearInput() {
    this._value.set('');
    this.onChange('');
    this.onTouched();
    this.change.emit('');
    this.onClear.emit();
  }

  /**
   * Función del evento `blur` del campo para marcar el campo como "touched"
   */
  onBlur() {
    setTimeout(() => this.onTouched());
    this.focused = false;
    this.blur.emit();
  }

  /**
   * Función para manejar el evento de clic en el prefijo del input
   * Emite un evento para que el componente padre pueda reaccionar
   */
  prefixClicked() {
    this.prefixClick.emit();
  }

  /**
   * Función para manejar el evento de clic en el sufijo del input
   * Emite un evento para que el componente padre pueda reaccionar
   */
  suffixClicked() {
    this.suffixClick.emit();
  }

  /**
   * Función para obtener el elemento nativo del input
   */
  get nativeElement(): HTMLInputElement {
    return this.inputRef.nativeElement;
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any) {
    if (this.type === 'number') this._value.set(value || 0);
    else this._value.set(value);
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
