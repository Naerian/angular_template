import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  forwardRef,
  input,
  Input,
  InputSignal,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { InputSize } from '../models/form-field.model';

/**
 * @name
 * neo-textarea
 * @description
 * Componente para crear un campo de texto de varias líneas
 * @example
 * <neo-textarea [value]="'Texto'" [label]="'Label'" [name]="'name'" [id]="'id'" [placeholder]="'Placeholder'" [rows]="5" [cols]="10" [maxlength]="100" [resize]="true" [inputSize]="'m'"></neo-textarea>
 */
@Component({
  selector: 'neo-textarea',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss', './../form-fields-settings.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class TextAreaComponent {
  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() rows: number = 3;
  @Input() cols?: number;
  @Input() maxlength?: number;
  @Input() resize?: boolean = true;
  @Input() inputSize: InputSize = 'm';
  @Output() change = new EventEmitter<string>();
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
  _value: string = '';
  @Input() set value(value: string) {
    this._value = value;
  }

  get value(): string | null {
    return this._value;
  }

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  constructor(private readonly _inputsUtilsService: InputsUtilsService) {}

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set(this._inputsUtilsService.createUniqueId('textarea'));
    this._labelId?.set(`label_${this._id()}`);
  }

  /**
   * Función para obtener el aria-describedby personalizado
   * que incluye el hint y el error del campo.
   * @return {string}
   */
  get ariaDescribedByCustom(): string {
    return this._inputsUtilsService.getAriaDescribedByCustom(this._id());
  }

  /**
   * Función del evento `input` del campo para obtener el valor introducido
   * @param {string} value
   */
  onInput(value: string) {
    this._value = value;
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
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any) {
    this._value = value;
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
