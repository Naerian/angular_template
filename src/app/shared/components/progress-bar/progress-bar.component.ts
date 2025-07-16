import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  InputSignal,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ProgressBarValuePosition,
  ProgressBarValueFormat,
  ProgressBarLabelPosition,
} from './models/progress-bar.model';
import {
  ComponentSize,
  NeoComponentConfig,
} from '@shared/configs/component.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { DEFAULT_SIZE } from '@shared/configs/component.consts';

/**
 * Componente de barra de progreso que muestra el progreso de una tarea.
 * Permite personalizar el tamaño, color, valor y formato del progreso.
 *
 * @example
 * <neo-progress-bar [value]="50" [maxValue]="100" [size]="'m'" [color]="'#4CAF50'"></neo-progress-bar>
 */
@Component({
  selector: 'neo-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProgressBarComponent {
  /**
   * Define el tamaño de la barra de progreso.
   */
  _size: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set size(value: ComponentSize) {
    this._size.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get size(): ComponentSize {
    return this._size();
  }

  /**
   * Define el valor actual de la barra de progreso.
   * Debe ser un número entre 0 y 100 para porcentaje o el numerador para formato fraccional.
   * @type {InputSignal<number | null>}
   * @default 0
   */
  value: InputSignal<number | null> = input<number | null>(0);

  /**
   * Define el valor máximo cuando el formato es fraccional.
   * @type {InputSignal<number | null>}
   * @default 100
   */
  maxValue: InputSignal<number | null> = input<number | null>(100);

  /**
   * Si es `true`, la barra de progreso estará en modo indeterminado.
   * @type {InputSignal<boolean>}
   * @default false
   */
  indeterminate: InputSignal<boolean> = input<boolean>(false);

  /**
   * Si es `true`, oculta el valor de la barra de progreso.
   * @type {InputSignal<boolean>}
   * @default false
   */
  hideValue: InputSignal<boolean> = input<boolean>(false);

  /**
   * Color de la barra de progreso. Puede ser una variable CSS o un valor hexadecimal.
   * @type {InputSignal<string>}
   * @default 'var(--color-primary)'
   */
  color: InputSignal<string> = input<string>('var(--color-primary)');

  /**
   * Color de fondo de la barra de progreso.
   * @type {InputSignal<string>}
   * @default 'var(--bg-field-color)'
   */
  backgroundColor: InputSignal<string> = input<string>(
    'var(--color-secondary)',
  );

  /**
   * Color del texto que muestra el valor de la barra de progreso.
   * @type {InputSignal<string>}
   * @default 'var(--color-text)'
   */
  valueColor: InputSignal<string> = input<string>('var(--color-white)');

  /**
   * Define la posición del valor de la barra de progreso.
   * @type {InputSignal<ProgressBarValuePosition>}
   * @default 'hidden'
   */
  valuePosition: InputSignal<ProgressBarValuePosition> =
    input<ProgressBarValuePosition>('inside');

  /**
   * Define el formato en que se muestra el valor de la barra de progreso.
   * @type {InputSignal<ProgressBarValueFormat>}
   * @default 'percentage'
   */
  valueFormat: InputSignal<ProgressBarValueFormat> =
    input<ProgressBarValueFormat>('percentage');

  /**
   * Etiqueta opcional para la barra de progreso.
   * Se usará para proporcionar contexto visual y accesible.
   * @type {InputSignal<string | null>}
   * @default null
   */
  label: InputSignal<string | null> = input<string | null>(null);

  /**
   * Define la posición del valor de la barra de progreso.
   * @type {InputSignal<ProgressBarLabelPosition>}
   * @default 'top'
   */
  labelPosition: InputSignal<ProgressBarLabelPosition> =
    input<ProgressBarLabelPosition>('top');

  /**
   * Si es `true` y la barra no es indeterminada, el valor numérico se añadirá
   * como texto dentro de la etiqueta (`label`). Esto significa que el valor
   * se mostrará junto a la etiqueta en la posición definida por `labelPosition`.
   * @type {InputSignal<boolean>}
   * @default false
   */
  combineLabelValue: InputSignal<boolean> = input<boolean>(false);

  // ID único y ID de la etiqueta
  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');

  /**
   * Calcula el porcentaje de la barra de progreso.
   * Si es indeterminado o el valor es nulo, devuelve 0.
   * Si el formato es fraccional, calcula el porcentaje basado en `value` y `maxValue`.
   * @type {WritableSignal<number>}
   */
  _percentage: WritableSignal<number> = signal(0);

  /**
   * Computa el estilo de `width` para la barra de progreso.
   * @type {Signal<string>}
   */
  _progressBarWidth = computed(() => {
    if (this.indeterminate()) {
      return '100%'; // En modo indeterminado, la barra base ocupa todo el ancho
    }

    const val = this.value();
    const max = this.maxValue();

    if (val === null || max === null || max === 0) {
      return '0%';
    }

    // Asegurarse de que el porcentaje esté entre 0 y 100
    const percentage = Math.max(0, Math.min(100, (val / max) * 100));
    return `${percentage}%`;
  });

  /**
   * Computa el texto a mostrar para el valor numérico de la barra de progreso (sin la etiqueta).
   * @type {Signal<string>}
   */
  _computedValueOnlyText = computed(() => {
    if (this.indeterminate()) {
      return ''; // No show text if indeterminate
    }

    const val = this.value();
    const max = this.maxValue();

    if (val === null || max === null) {
      return '';
    }

    if (this.valueFormat() === 'percentage') {
      const percentage = Math.round((val / max) * 100);
      return `${percentage}%`;
    } else {
      return `${val}/${max}`;
    }
  });

  /**
   * Computa el texto final que se mostrará en la etiqueta externa,
   * combinando el label y el valor si combineLabelValue es true.
   * @type {Signal<string | null>}
   */
  _finalLabelText = computed(() => {
    if (!this.label() && !this.combineLabelValue()) {
      return null; // No label and not combining value into label
    }

    if (this.indeterminate()) {
      return this.label(); // If indeterminate, only show the label, no value text
    }

    if (this.combineLabelValue()) {
      const valueText = this._computedValueOnlyText();
      if (this.label() && valueText) {
        return `${this.label()} ${valueText}`; // Example: "Cargando... 50%"
      } else if (this.label()) {
        return this.label();
      } else if (valueText) {
        return valueText;
      } else {
        return null;
      }
    } else {
      return this.label(); // Show only the label
    }
  });

  /**
   * Computa el texto para aria-valuetext.
   * Proporciona la descripción más completa posible para el lector de pantalla.
   * @type {Signal<string | null>}
   */
  _ariaValueText = computed(() => {
    if (this.indeterminate()) {
      return null; // ARIA attributes should be absent for indeterminate state
    }

    if (this.combineLabelValue() && this._finalLabelText()) {
      // If combined, the combined text is the most descriptive accessible name
      return this._finalLabelText();
    } else if (this.label()) {
      // If there's a separate label, use it as the primary description
      return this.label();
    } else if (
      this.valuePosition() !== 'hidden' &&
      this._computedValueOnlyText()
    ) {
      // If no label but value is displayed, use the value text
      return this._computedValueOnlyText();
    }
    return null; // Fallback if no relevant text to describe
  });

  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    // Inicializamos el tamaño del botón con el valor por defecto de la configuración global
    this._size.set(this.globalConfig.defaultSize || DEFAULT_SIZE);

    // Actualiza el porcentaje cuando el valor o maxValue cambian
    // Esto se mantiene reactivo gracias a `computed`
    computed(() => {
      const val = this.value();
      const max = this.maxValue();
      if (val !== null && max !== null && max > 0) {
        this._percentage.set((val / max) * 100);
      } else {
        this._percentage.set(0);
      }
    });
  }

  ngOnInit(): void {
    this.setProperties();
  }

  /**
   * Método para establecer las propiedades por defecto del componente.
   */
  setProperties() {
    if (this.size) this._size.set(this.size);
  }

  /**
   * Función para crear un ID único para la barra de progreso.
   * Este ID se puede usar para asociar la barra de progreso con su etiqueta.
   */
  createUniqueId(): void {
    if (this._id()) return;
    this._id.set('progress_bar_' + crypto.randomUUID());
    this._labelId.set(`label_${this._id()}`);
  }
}
