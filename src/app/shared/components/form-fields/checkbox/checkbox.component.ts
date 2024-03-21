import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, WritableSignal, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize } from '../models/form-field.entity';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';

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
  styleUrls: ['./checkbox.component.scss', './../form-fields-settings.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }]
})
export class CheckboxComponent implements ControlValueAccessor {

  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('checkboxContent') checkboxContent!: ElementRef;

  @Input() label?: string;
  @Input() name?: string;
  @Input() inputSize: InputSize = 'm';
  @Output() readonly change: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Input para marcar el checkbox como seleccionado
   */
  @Input() set checked(status: boolean) {
    this._checked.set(status);
  }
  get checked() {
    return this._checked();
  }

  /**
   * Input para marcar el checkbox como indeterminado
   */
  @Input() set indeterminate(status: boolean) {
    this._indeterminate.set(status);
    if (status) {
      if (this._inputElement)
        this._inputElement.nativeElement.indeterminate = this.indeterminate;
      this._checked.set(false);
    }

  }

  get indeterminate(): boolean {
    return this._checked();
  }

  /**
   * Input para marcar el checkbox como deshabilitado
   */
  @Input() set disabled(status: boolean) {
    this._disabled.set(status);
  }
  get disabled() {
    return this._disabled();
  }

  _indeterminate: WritableSignal<boolean> = signal(false);
  _checked: WritableSignal<boolean> = signal(false);
  _disabled: WritableSignal<boolean> = signal(false);

  _title: WritableSignal<string> = signal('');
  _id: WritableSignal<string> = signal('');

  constructor(
    private readonly _inputsUtilsService: InputsUtilsService
  ) { }

  ngAfterViewInit(): void {
    this.createTitle();
    this.createUniqueId();
  }

  /**
  * Función para crear el título del checkbox
  */
  createTitle() {
    if (!this._title())
      this._title.set(this.checkboxContent?.nativeElement?.innerHTML.replace(/(<([^>]+)>)/gi, "") || '');
  }

  /**
   * Función para crear un ID único a partir del nombre
   */
  createUniqueId(): void {
    if (!this._id())
      this._id.set(this._inputsUtilsService.createUniqueId('neo_checkbox'));
  }

  /**
   * Función para activar o desactivar el checkbox
   */
  onClickTargetCheckbox() {

    if (this._disabled())
      return;
    else
      this._inputElement.nativeElement.focus();

    this._checked.set(!this._checked());
    this._inputElement.nativeElement.checked = this._checked();
    this.onChange(this._checked());
    this.onTouched();
    this.change.emit(this._checked());
  }

  /**
   * Función lanzada cuando se produce un cambio en el checkbox
   * para evitar que se propague el evento al padre
   * @param {Event} event
   */
  onChangeCheckbox(event: Event) {
    event.stopPropagation();
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(checked: boolean) {
    this._checked.set(checked);
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this._disabled.set(isDisabled);
  }

}
