import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  InputSignal,
  Output,
  ViewChild,
  WritableSignal,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import {
  ComponentSize,
  NeoComponentConfig,
} from '@shared/configs/component.model';

/**
 * @name
 * neo-checkbox
 * @description
 * Componente para crear un checkbox con funcionalidad de control de formulario
 * @example
 * <neo-checkbox [(ngModel)]="checked"></neo-checkbox>
 * <neo-checkbox formControlName="check_name"></neo-checkbox>
 * <neo-checkbox [checked]="true"></neo-checkbox>
 * <neo-checkbox [indeterminate]="true"></neo-checkbox>
 * <neo-checkbox [disabled]="true"></neo-checkbox>
 */
@Component({
  selector: 'neo-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @ViewChild('contentWrapper', { static: true })
  contentWrapper!: ElementRef<HTMLDivElement>;

  @Input() showHeader: boolean = true;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() label?: string;
  @Input() name?: string;


  /**
   * Tamaño del checkbox.
   */
  _inputSize: WritableSignal<ComponentSize> = signal('m');
  @Input()
  set inputSize(value: ComponentSize) {
    this._inputSize.set(value || this.globalConfig.defaultSize || 'm');
  }
  get inputSize(): ComponentSize {
    return this._inputSize();
  }

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

  @Output() changed = new EventEmitter<boolean>();

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly globalConfig = inject(
    NEOUI_COMPONENT_CONFIG,
  );

  constructor() {
    // Inicializamos el tamaño del checkbox con el valor por defecto de la configuración global
    this._inputSize.set(this.globalConfig.defaultSize || 'm');
  }

  onChange = (_: boolean) => {};
  onTouched = () => {};

  ngOnInit(): void {
    // Si se ha proporcionado un tamaño, lo establecemos
    if (this.inputSize) this._inputSize.set(this.inputSize);
  }

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
   * Función para crear un id único para el label del checkbox
   */
  createUniqueId() {
    if (this._id()) return; // Si ya existe, no generamos otro
    const uniqueId = this._inputsUtilsService.createUniqueId('checkbox');
    this._id.set(uniqueId);
    this._labelId.set(`label_${uniqueId}`);
  }

  /**
   * Función para alternar el estado checked del checkbox
   * Si el checkbox está deshabilitado, no hace nada
   * Si no, alterna el estado checked y emite el evento changed
   */
  toggleChecked() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.indeterminate = false;
    this.onChange(this.checked);
    this.changed.emit(this.checked);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (val: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
