import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputsUtilsService } from '../services/inputs-utils.service';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ButtonMode } from '@shared/components/button/models/button.model';
import { ComponentColor, ComponentSize } from '@shared/configs/component.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@shared/configs/component.consts';

@Component({
  selector: 'neo-input-file',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
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
  @Input() extensions?: string | string[];
  @Input() label?: string;
  @Input() name?: string;
  @Input() allWidth: boolean = false;
  @Input() transparent: boolean = false;
  @Input() mode: ButtonMode = 'button';

  _inputSize: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set inputSize(value: ComponentSize) {
    this._inputSize.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get inputSize(): ComponentSize {
    return this._inputSize();
  }

  _color: WritableSignal<ComponentColor> = signal(DEFAULT_COLOR);
  @Input()
  set color(value: ComponentColor) {
    this._color.set(value || this.globalConfig.defaultColor || DEFAULT_COLOR);
  }
  get color(): ComponentColor {
    return this._color();
  }

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

  _value = signal<FileList | null>(null);
  get value(): any[] {
    const files = this._value();
    return files
      ? Array.from(files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          webkitRelativePath: file.webkitRelativePath,
        }))
      : [];
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

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  protected readonly _translations: NeoUITranslations =
    inject(NEOUI_TRANSLATIONS);
  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    this._inputSize.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
    this._color.set(this.globalConfig.defaultColor || DEFAULT_COLOR);
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
    if (this.color) this._color.set(this.color);
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (this._id()) return;
    this._id?.set(this._inputsUtilsService.createUniqueId('input-file'));
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
   * Función para controlar el evento de cambio de archivo
   * @param {Event} event
   */
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.onChange(files);
      this.filesSelected.emit(files);
      this._value.set(files);
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
