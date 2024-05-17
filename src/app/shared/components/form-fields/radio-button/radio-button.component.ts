import { Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, ViewChild, WritableSignal, booleanAttribute, signal } from '@angular/core';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import { NEO_RADIO_BUTTON_GROUP, RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { InputSize } from '../models/form-field.entity';

/**
 * @name
 * neo-radio-button
 * @description
 * Componente para crear un radio button con funcionalidad de control de formulario
 * @example
 * <neo-radio-button [(ngModel)]="value"></neo-radio-button>
 * <neo-radio-button formControlName="radio_name"></neo-radio-button>
 * <neo-radio-button [checked]="true"></neo-radio-button>
 * <neo-radio-button [disabled]="true"></neo-radio-button>
 * <neo-radio-button [value]="1"></neo-radio-button>
 */
@Component({
  selector: 'neo-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss', './../form-fields-settings.scss'],
  host: {
    '(focus)': '_inputElement.nativeElement.focus()',
  }
})
export class RadioButtonComponent {

  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('radioButtonContent') radioButtonContent!: ElementRef;

  /**
   * Input para asignar el tamaño del radio button
   */
  _inputSize: WritableSignal<InputSize> = signal('m');
  @Input() set inputSize(value: InputSize) {
    this._inputSize.set(value || 'm');
  }

  get inputSize() {
    return this._inputSize();
  }

  /**
   * Input para asignar el ID del radio button
   */
  @Input() set id(value: string) {
    this._id.set(value);
    this._labelId.set(`label_${value}`);
  }
  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');

  get id() {
    return this._id();
  }

  /**
   * Input para asignar el valor del radio button y asignar el valor al grupo de radio buttons
   */
  _value: any = null;
  @Input() set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {

        // Si no está marcado y el valor del grupo es el mismo que el valor del radio button, lo marcamos
        if (!this.checked)
          this.checked = this.radioGroup.value === value;

        // Si el radio button está seleccionado, actualiza el valor del grupo de radio buttons
        if (this.checked)
          this.radioGroup.selected = this;
      }
    }
  }

  get value(): any {
    return this._value;
  }


  /**
   * Input para asignar el estado deshabilitado del radio button
   */
  _disabled: WritableSignal<boolean> = signal(false);

  @Input({ transform: booleanAttribute }) set disabled(value: boolean) {
    if (this._disabled() !== value)
      this._disabled.set(value);
  }

  get disabled(): boolean {
    return this._disabled() || (this.radioGroup !== null && this.radioGroup.disabled);
  }

  /**
   * Input para asignar el nombre del radio buttons
   */
  @Input() set name(value: string) {

    this._name.set(value);

    // Actualizamos el ID del radio button
    this.createUniqueId();
  };

  _name: WritableSignal<string> = signal('');
  get name() {
    return this._name();
  }

  /**
   * Input para asignar el estado marcado del radio button
   */
  _checked: WritableSignal<boolean> = signal(false);
  @Input({ transform: booleanAttribute }) set checked(value: boolean) {
    if (this.checked !== value) {

      this._checked.set(value);

      // Si el radio button está marcado y el grupo de radio buttons tiene un valor diferente, actualiza el valor del grupo
      if (value && this.radioGroup && this.radioGroup.value !== this.value)
        this.radioGroup.selected = this;
      else if (!value && this.radioGroup && this.radioGroup.value === this.value)
        this.radioGroup.selected = null;


      // Si el radio button está marcado, notifica al dispatcher para desmarcar otros radio buttons con el mismo nombre
      if (value)
        this._radioDispatcher.notify(this.id, this.name);
    }
  }

  get checked(): boolean {
    return this._checked();
  }

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  /**
   * Evento emitido cuando cambia el estado marcado del radio button.
   * Los eventos `change` solo se emiten cuando el valor cambia debido a la interacción del usuario con
   * el radio button (el mismo comportamiento que `<input type="radio">`).
   */
  @Output() readonly change: EventEmitter<any> = new EventEmitter<any>();

  radioGroup: RadioButtonGroupComponent | null = null;

  _title: WritableSignal<string> = signal('');

  // Nos servirá para desuscribirnos del _radioDispatcher
  private _removeUniqueSelectionListener: () => void = () => { };

  constructor(
    @Optional() @Inject(NEO_RADIO_BUTTON_GROUP) radioGroup: RadioButtonGroupComponent,
    private _radioDispatcher: UniqueSelectionDispatcher,
    private readonly _inputsUtilsService: InputsUtilsService
  ) {
    this.radioGroup = radioGroup;
  }

  ngAfterViewInit(): void {
    this.createTitle();
    this.createUniqueName();
    this.updateSize();
  }

  ngOnInit() {
    if (this.radioGroup) {

      // Si el radio está dentro de un grupo de radio, determina si debe estar marcado
      this.checked = this.radioGroup.value === this.value;

      // Si el radio button está marcado, actualiza el radio button seleccionado del grupo
      if (this.checked)
        this.radioGroup.selected = this;

    }

    // Utilizamos `_radioDispatcher` para notificar a otros radio buttons con el mismo nombre para desmarcar.
    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id && name === this.name)
        this.checked = false;
    });
  }

  /**
   * Función para crear el título del radio button
   */
  createTitle() {
    this._title.set(this.radioButtonContent?.nativeElement?.innerHTML.replace(/(<([^>]+)>)/gi, "") || '');
  }

  /**
   * Función para crear name único a partir del label del radio button
   */
  createUniqueName(): void {

    // Copia el nombre del grupo de radio padre si no tiene nombre y el grupo de radio tiene nombre
    if (this.radioGroup?.name)
      this.name = this.radioGroup.name;

    // Si no tiene nombre, crea un nombre único
    if (!this._name() && !this.radioGroup?.name) {
      this.name = this._inputsUtilsService.createUniqueId(this._title() || 'neo_radio');
    }
  }

  /**
   * Función para asignar el tamaño del radio button group al hijo
   */
  updateSize(): void {
    if (this.radioGroup) {
      this._inputSize.set(this.radioGroup.inputSize || 'm');
    }
  }

  /**
   * Función para crear un ID único a partir del nombre
   */
  createUniqueId(): void {
    if (!this.id) {
      this._id.set(this._inputsUtilsService.createUniqueId('neo_radiobutton'));
      this._labelId.set(`label_${this._id()}`);
    }
  }

  /**
   * Función para emitir el evento de cambio del radio button con el valor actual
   */
  _emitChangeEvent(): void {
    this.change.emit(this._value);
  }

  /**
   * Función para determinar si el radio button está marcado
   * @param {Event} event
   */
  onChangeRadioButton(event: Event) {

    event?.stopPropagation();

    // Si el radio button no está marcado y no está deshabilitado, lo marcamos
    // y emitimos el evento de cambio al grupo de radio buttons
    if (!this.checked && !this.disabled) {

      this.checked = true;

      this._emitChangeEvent();

      // Actualiza el radio button seleccionado del grupo
      if (this.radioGroup)
        this.radioGroup.changeValue(this.value);

    }
  }

  /**
   * Función lanzada cuando el usuario hace clic en el radio button
   * @param {Event} event
   */
  onClickTargetRadioButton(event: Event) {

    this.onChangeRadioButton(event);

    // Si el radio button no está deshabilitado, enfocamos el input
    if (!this._disabled())
      this._inputElement.nativeElement.focus();

  }

  ngOnDestroy() {
    this._removeUniqueSelectionListener();
  }
}
