import {
  Component,
  EventEmitter,
  Input,
  InputSignal,
  Output,
  WritableSignal,
  booleanAttribute,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize } from '../models/form-field.model';
import { InputsUtilsService } from '../services/inputs-utils.service';

@Component({
  selector: 'neo-input-file',
  standalone: true,
  imports: [],
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss', './../form-fields-settings.scss'],
  host: {
    class: 'neo-input-file',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true,
    },
  ],
})
export class InputFileComponent implements ControlValueAccessor {
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input() title?: string;
  @Input() extensions?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() inputSize: InputSize = 'm';

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  /**
   * Input para indicar si el campo es multiple
   */
  @Input({ transform: booleanAttribute })
  get multiple(): boolean {
    return this._multiple();
  }
  set multiple(value: boolean) {
    this._multiple.set(value);
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
   * Output para emitir los archivos seleccionados
   */
  @Output() filesSelected: EventEmitter<FileList> = new EventEmitter();

  private _multiple: WritableSignal<boolean> = signal(false);

  constructor(private readonly _inputsUtilsService: InputsUtilsService) {}

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set(this._inputsUtilsService.createUniqueId('input-file'));
    this._labelId?.set(`label_${this._id()}`);
  }

  /**
   * Función para controlar el evento de cambio de archivo
   * @param {Event} event
   */
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.onChange(files);
      this.filesSelected.emit(files);
    }
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {}

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
