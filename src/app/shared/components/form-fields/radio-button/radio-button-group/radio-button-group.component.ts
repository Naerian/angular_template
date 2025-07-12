import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from '../radio-button.component';
import { InputsUtilsService } from '../../services/inputs-utils.service';
import { RadioButtonsOrientation } from '../models/radio-button.model';
import { Subject, takeUntil } from 'rxjs';

/**
 * @name
 * neo-radio-button-group
 * @description
 * Componente que actúa como un grupo de botones de radio, gestionando la selección de sus hijos 'neo-radio-button'.
 * Implementa ControlValueAccessor para integración con formularios reactivos y basados en plantillas.
 * @example
 * <neo-radio-button-group [(ngModel)]="selectedOption">
 *      <neo-radio-button value="option1">Opción 1</neo-radio-button>
 *      <neo-radio-button value="option2">Opción 2</neo-radio-button>
 *      <neo-radio-button value="option3">Opción 3</neo-radio-button>
 * </neo-radio-button-group>
 */
@Component({
  selector: 'neo-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonGroupComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RadioButtonGroupComponent
  implements ControlValueAccessor, AfterContentInit
{
  @ContentChildren(RadioButtonComponent)
  radioButtons!: QueryList<RadioButtonComponent>;

  /**
   * Input para asignar un label al grupo de radio buttons
   */
  @Input() label?: string;

  /**
   * Input para asignar la dirección del grupo de radio buttons (horizontal | vertical)
   */
  _orientation: WritableSignal<RadioButtonsOrientation> = signal('horizontal');
  @Input()
  set orientation(val: RadioButtonsOrientation) {
    this._orientation.set(val);
  }
  get orientation(): RadioButtonsOrientation {
    return this._orientation();
  }

  /**
   * Nombre del grupo de radio buttons. Esto es importante para que solo uno pueda ser seleccionado a la vez.
   */
  _name: WritableSignal<string> = signal('');
  @Input()
  set name(val: string) {
    this._name.set(val);
  }
  get name(): string {
    return this._name();
  }

  /**
   * Indica si el grupo de radio buttons está deshabilitado.
   * Si se establece en `true`, todos los radio buttons dentro del grupo estarán deshabilitados.
   */
  _disabled: WritableSignal<boolean> = signal(false);
  @Input()
  set disabled(val: boolean) {
    this._disabled.set(val);
  }
  get disabled(): boolean {
    return this._disabled();
  }

  /**
   * Valor actualmente seleccionado en el grupo.
   */
  _value: WritableSignal<any> = signal(null);
  get value(): any {
    return this._value();
  }
  @Input() set value(val: any) {
    this._value.set(val);
    this.updateRadioButtons();
  }

  /**
   * Emite el valor seleccionado cuando hay un cambio.
   */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Señal para generar un ID único para el contenedor principal del grupo (el div con role="radiogroup").
   */
  _groupId: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  @Input()
  set id(value: string) {
    this._groupId.set(value);
    this._labelId.set(`label_${value}`);
    this._name.set(value);
  }
  get id(): string {
    return this._groupId();
  }

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly ngUnsubscribe$: Subject<any> = new Subject<any>();

  // Funciones internas para ControlValueAccessor
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    // Crear un ID único para el grupo de radio buttons
    this.createUniqueId();
  }

  ngAfterContentInit(): void {
    // Suscribirse a los cambios de los radio buttons hijos
    this.radioButtons.forEach((button) => {
      this.setRadioButtonAttributes(button);
    });

    // En caso de que se añadan dinámicamente, re-suscribirse
    this.radioButtons?.changes.subscribe(
      (buttons: QueryList<RadioButtonComponent>) => {
        buttons.forEach((button) => {
          this.setRadioButtonAttributes(button);
        });
        this.updateRadioButtons();
      },
    );

    this.updateRadioButtons();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(null);
    this.ngUnsubscribe$.complete();
  }

  /**
   * Función para crear un ID único para el grupo de radio buttons.
   * Este ID se puede usar para asociar el grupo con su etiqueta.
   */
  createUniqueId(): void {
    if(this._groupId()) return;
    const uniqueId = this._inputsUtilsService.createUniqueId('radio-group');
    this._name.set(uniqueId); // Asigna un nombre único al grupo
    this._groupId.set(uniqueId);
    this._labelId.set(`label_${uniqueId}`);
  }

  /**
   * Función para estlabecer los atributos de los radio buttons hijos
   */
  private setRadioButtonAttributes(button: RadioButtonComponent): void {
    if (this.radioButtons && this.radioButtons.length > 0 && button) {
      const uniqueId = this._inputsUtilsService.createUniqueId('radio-button');
      button.id = uniqueId; // Asigna un ID único basado en el valor
      button.name = this.name; // Asegura que todos los radios tienen el mismo nombre
      button.checked = button.value === this.value; // Inicializa el estado
      button.disabled = button?.disabled ? button.disabled : this.disabled; // Establece el estado deshabilitado si el grupo está deshabilitado
      button.change
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((selectedVal) => {
          this.writeValue(selectedVal); // Actualiza el valor del grupo
          this.onChange(selectedVal); // Notifica el cambio al formulario
          this.onTouched(); // Marca el control como 'touched'
          this.change.emit(selectedVal); // Emite el evento de cambio
        });
    }
  }

  /**
   * Escribe un nuevo valor desde el control del formulario al componente.
   * @param value El valor a escribir.
   */
  writeValue(value: any): void {
    if (value !== this._value()) {
      this._value.set(value);
      this.updateRadioButtons();
    }
  }

  /**
   * Registra una función a llamar cuando el valor del control cambia.
   * @param fn La función a registrar.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra una función a llamar cuando el control es 'tocado' (blur).
   * @param fn La función a registrar.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Actualiza el estado 'checked' de los radio buttons hijos según el valor del grupo.
   */
  private updateRadioButtons(): void {
    if (this.radioButtons) {
      this.radioButtons.forEach((button) => {
        button.checked = button.value === this._value();
      });
    }
  }

  /**
   * Establece el estado deshabilitado del control.
   * @param isDisabled Si el control debe estar deshabilitado.
   */
  setDisabledState?(isDisabled: boolean): void {
    if (this.radioButtons) {
      this.radioButtons.forEach((button) => {
        button.disabled = isDisabled;
      });
    }
  }
}
