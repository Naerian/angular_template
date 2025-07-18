import { CommonModule, JsonPipe } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, forwardRef, input, Input, InputSignal, Output, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { InputAutocomplete, InputSize, InputType } from '../models/form-field.entity';

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
  styleUrls: ['./input.component.scss', './../form-fields-settings.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe]
})
export class InputComponent implements ControlValueAccessor {

  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder: string = '';
  @Input() type: InputType = "text";
  @Input() autocomplete: InputAutocomplete = 'off';
  @Input() size?: number;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() min?: number;
  @Input() max?: number;
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
      this._id.set(this._inputsUtilsService.createUniqueId(this.label || this.title || 'input'));
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
   * Funciones de control de eventos
   */
  onChange: any = () => { };
  onTouched: any = () => { };

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any) {
    if (this.type === 'number')
      this._value.set(value || 0);
    else
      this._value.set(value);
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
