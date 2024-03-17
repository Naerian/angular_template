import { Component, ContentChildren, EventEmitter, InjectionToken, Input, Output, QueryList, WritableSignal, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { InputSize } from '../../models/form-field.entity';
import { RadioButtonComponent } from '../radio-button.component';
import { DirectionRadioButtonGroup } from '../models/radio-button.entity';

/**
 * Permite inyectar el componente RadioButtonGroupComponent en el componente RadioButtonComponent
 * para poder acceder a sus propiedades y métodos desde el componente RadioButtonComponent hijo
 */
export const NEO_RADIO_BUTTON_GROUP = new InjectionToken<RadioButtonGroupComponent>('RadioButtonGroupComponent');

/**
 * @name
 * neo-radio-button-group
 * @description
 * Componente para crear un grupo de radio buttons con funcionalidad de control de formulario mediante el componente `neo-radio-button`
 * @example
 * <neo-radio-button-group formControlName="radio_name" inputSize='m' label="Grupo de radio buttons" direction="horizontal">
 *   <neo-radio-button [value]="1">Opción 1</neo-radio-button>
 *   <neo-radio-button [value]="2">Opción 2</neo-radio-button>
 *   <neo-radio-button [value]="3">Opción 3</neo-radio-button>
 * </neo-radio-button-group>
 *
 * <neo-radio-button-group [(ngModel)]="value" inputSize='m' label="Grupo de radio buttons" direction="horizontal">
 *   <neo-radio-button [value]="1">Opción 1</neo-radio-button>
 *   <neo-radio-button [value]="2">Opción 2</neo-radio-button>
 *   <neo-radio-button [value]="3">Opción 3</neo-radio-button>
 * </neo-radio-button-group>
 */
@Component({
  selector: 'neo-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrl: './radio-button-group.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonGroupComponent),
    multi: true,
  },
  { provide: NEO_RADIO_BUTTON_GROUP, useExisting: RadioButtonGroupComponent },]
})
export class RadioButtonGroupComponent implements ControlValueAccessor {

  @ContentChildren(forwardRef(() => RadioButtonComponent), { descendants: true }) radioButtons!: QueryList<RadioButtonComponent>;

  /**
   * Input para asignar el título del grupo de radio buttons
   */
  @Input() label?: string;

  /**
   * Input para ocultar el título del grupo de radio buttons
   */
  @Input() hideLabel: boolean = false;

  /**
   * Input para asignar la dirección del grupo de radio buttons (horizontal | vertical)
   */
  @Input() direction: DirectionRadioButtonGroup = 'horizontal';

  /**
   * Input para asignar el tamaño del grupo de radio buttons
   */
  @Input()
  get inputSize() {
    return this._inputSize;
  }
  set inputSize(value: InputSize) {

    this._inputSize = value || 'm';

    // Actualizamos el nombre de cada radio button del grupo
    this.updateInputSizeRadioButtons();
  }

  /**
   * Input para asignar el nombre del grupo de radio buttons
   */
  @Input()
  get name() {
    return this._name();
  }
  set name(value: string) {
    this._name.set(value);

    // Actualizamos el nombre de cada radio button del grupo
    this.updateRadioButtonsName();
  }

  /**
   * Input para deshabilitar el grupo de radio buttons
   */
  @Input()
  set disabled(status: boolean) {
    this._disabled.set(status);

    // Deshabilitamos cada radio button del grupo si el grupo está deshabilitado
    this.disableRadioButtons();
  }
  get disabled() {
    return this._disabled();
  }

  /**
   * Input para seleccionar el radio button del grupo
   */
  @Input()
  get selected() {
    return this._selected;
  }
  set selected(selected: RadioButtonComponent | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this.checkSelectedRadioButton();
  }

  /**
   * Input para asignar el valor del grupo de radio buttons
   */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (this._value !== newValue) {

      this._value = newValue;

      // Actualizamos el radio button seleccionado a partir del valor
      this.updateSelectedRadioFromValue();
      this.checkSelectedRadioButton();
    }
  }

  /**
   * Evento emitido cuando cambia el estado marcado del grupo de radio buttons.
   * Los eventos `change` solo se emiten cuando el valor cambia debido a la interacción del usuario con
   * el radio button (el mismo comportamiento que `<input type="radio">`).
   */
  @Output() readonly change: EventEmitter<any> = new EventEmitter<any>();

  _title: WritableSignal<string> = signal('');
  private _selected: RadioButtonComponent | null = null;
  private _disabled: WritableSignal<boolean> = signal(false);
  private _value: any = null;
  private _inputSize: InputSize = 'm';
  private _name: WritableSignal<string> = signal('');

  constructor(
    private readonly _inputsUtilsService: InputsUtilsService
  ) { }

  ngAfterViewInit(): void {

    this.createTitle();

    if (!this._name()) {
      this._name.set(this._inputsUtilsService.createUniqueId(this.label || 'neo_group_radio'));
      this.updateRadioButtonsName();
    }

  }

  createTitle() {
    this._title.set(this.label?.replace(/(<([^>]+)>)/gi, "") || '');
  }

  /**
   * Actualiza el radio button seleccionado
   */
  private checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /**
   * Actualiza el radio button seleccionado a partir del valor
   */
  private updateSelectedRadioFromValue(): void {

    // Si el valor es null, no seleccionamos ningún radio button
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    // Si hay un radio button seleccionado y no es el mismo que el valor, lo deseleccionamos
    if (this.radioButtons && !isAlreadySelected) {
      this._selected = null;
      this.radioButtons.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  /**
   * Actualiza el inputSize de cada radio button del grupo
   */
  private updateInputSizeRadioButtons(): void {
    if (!this.radioButtons) return;
    this.radioButtons.forEach(radioButton => radioButton.inputSize = this._inputSize || 'm');
  }

  /**
   * Actualiza el nombre de cada radio button del grupo
   */
  private updateRadioButtonsName(): void {
    if (!this.radioButtons) return;
    this.radioButtons.forEach(radioButton => radioButton.name = this._name());
  }

  /**
   * Función para deshabilitar cada radio button del grupo
   */
  private disableRadioButtons(): void {
    if (!this.radioButtons) return;
    this.radioButtons.forEach(radioButton => radioButton.disabled = this._disabled());
  }

  /**
   * Función para emitir el evento de cambio del grupo de radio buttons con el valor actual
   */
  emitChangeEvent(): void {
    this.change.emit(this._value);
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: string | number | boolean) {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  changeValue(value: string | number | boolean) {
    this.onChange(value);
    this.onTouched();
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled.set(isDisabled);
  }

}
