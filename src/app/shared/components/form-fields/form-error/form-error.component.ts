import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormGroup, NgModel } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NeoFormErrorMessage } from './models/form-error.model';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';

/**
 * @name
 * neo-form-error
 * @description
 * Componente que muestra mensajes de error para un control de formulario,
 * ya sea reactivo o basado en plantillas mediante `NgModel`.
 * Este componente no tiene una dependencia directa de ninguna librería de traducción.
 * Los mensajes de error se esperan ya traducidos (o en su formato final) desde el control de formulario.
 * @example
 * * <neo-form-error [control]="form.get('nombreCampo')"></neo-form-error>
 * * <input [(ngModel)]="campo" name="campo" #campoNgModel="ngModel" />
 * <neo-form-error [ngModelControl]="campoNgModel"></neo-form-error>
 * * <neo-form-error [control]="form.get('nombreCampo')" [formGroup]="formGroup" controlName="campo"></neo-form-error>
 */
@Component({
  selector: 'neo-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormErrorComponent {
  /**
   * Referencia al AbstractControl asociado a este componente.
   * Usado con Reactive Forms.
   */
  @Input() control?: AbstractControl | null;

  /**
   * Referencia al NgModel asociado a este componente.
   * Usado con Template-Driven Forms.
   */
  @Input() ngModelControl?: NgModel | null;

  /**
   * Si se usa para errores de validación cruzada de un FormGroup,
   * se debe pasar el FormGroup completo.
   */
  @Input() formGroup?: FormGroup | null;

  /**
   * Nombre del control dentro del FormGroup, si se usa para validaciones cruzadas.
   */
  @Input() controlName?: string;

  /**
   * Input para añadir un aria-describedby al campo
   * Este ID se usará para asociar el hint con el control de formulario.
   */
  _id = signal('');
  @Input() set id(value: string) {
    this._id.set(value);
  }
  get id() {
    return this._id();
  }

  /**
   * Señal que contiene los mensajes de error a mostrar.
   * Cada mensaje es una cadena de texto ya traducida o final.
   */
  errors = signal<NeoFormErrorMessage[]>([]);

  // Variable privada para almacenar las traducciones del calendario por defecto o las inyectadas.
  protected _translations: NeoUITranslations = inject(NEOUI_TRANSLATIONS);

  private readonly ngUnsubscribe$: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.onChangeControls();
    this.updateErrorMessages();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(null);
    this.ngUnsubscribe$.complete();
  }

  /**
   * Subscripciones a cambios de estado y valor de los controles.
   */
  onChangeControls(): void {
    // Al producirse cambios de estado o valor en el control reactivo
    this.control?.statusChanges
      ?.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateErrorMessages());
    this.control?.valueChanges
      ?.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateErrorMessages());

    // Al producirse cambios de estado o valor en el NgModel
    this.ngModelControl?.statusChanges
      ?.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateErrorMessages());
    this.ngModelControl?.valueChanges
      ?.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateErrorMessages());
  }

  /**
   * Actualiza la lista de mensajes de error a partir de los errores del control o del FormGroup.
   */
  private updateErrorMessages(): void {
    if (this.formGroup && this.controlName) {
      this.errorMessagesFromFormGroup();
    } else if (this.control) {
      this.errorMessagesFromControl();
    } else if (this.ngModelControl) {
      this.errorMessagesFromNgModel();
    } else {
      this.errors.set([]);
    }
  }

  /**
   * Errores que provienen directamente del AbstractControl.
   */
  private errorMessagesFromControl() {
    // Si el control no existe o no tiene errores, no mostramos nada.
    if (
      !this.control?.errors ||
      (Array.isArray(this.control.errors) && this.control.errors.length === 0)
    ) {
      this.errors.set([]);
      return;
    }
    // Convertimos los errores a un formato de mensaje usable.
    this.errors.set(this.processErrors(this.control.errors));
  }

  /**
   * Errores que provienen del NgModel.
   */
  private errorMessagesFromNgModel() {
    // Si el control no existe, o no ha sido tocado/dirty, o no tiene errores, no mostramos nada.
    if (
      !this.ngModelControl?.errors ||
      (Array.isArray(this.ngModelControl.errors) &&
        this.ngModelControl.errors.length === 0)
    ) {
      this.errors.set([]);
      return;
    }
    // Convertimos los errores a un formato de mensaje usable.
    this.errors.set(this.processErrors(this.ngModelControl.errors));
  }

  /**
   * Errores que provienen del FormGroup (validaciones cruzadas).
   */
  private errorMessagesFromFormGroup() {
    if (!this.formGroup || !this.controlName) {
      this.errors.set([]);
      return;
    }

    const groupErrors = this.formGroup.errors ?? {};
    const controlErrors = this.control?.errors ?? {}; // Errores del control individual asociado

    const allErrors: Record<string, any> = { ...controlErrors };

    // Añadir errores de validación cruzada del FormGroup si están relacionados con este controlName
    Object.entries(groupErrors).forEach(([errorKey, errorValue]) => {
      // Asumimos que los validadores cruzados pueden devolver un objeto { [controlName]: { message: '...' } }
      // O que la clave del error es directamente el controlName
      if (
        typeof errorValue === 'object' &&
        errorValue !== null &&
        errorKey === this.controlName
      ) {
        allErrors[errorKey] = errorValue;
      }
      // Si el error a nivel de grupo tiene una propiedad que coincide con el controlName
      if (
        errorValue &&
        typeof errorValue === 'object' &&
        this.controlName !== undefined &&
        errorValue[this.controlName]
      ) {
        allErrors[errorKey] = errorValue;
      }
    });

    // Si no hay errores en el control o en el FormGroup, no mostramos nada
    if (
      !this.control ||
      Object.keys(allErrors).length === 0 ||
      allErrors === null ||
      allErrors === undefined
    ) {
      this.errors.set([]);
      return;
    }

    // Procesa todos los errores combinados
    this.errors.set(this.processErrors(allErrors));
  }

  /**
   * Procesa un objeto de errores de Angular para extraer mensajes.
   * Esta función es donde se esperaría que el validador personalizado
   * proporcione directamente el mensaje traducido o un objeto con un 'message'.
   */
  private processErrors(errors: Record<string, any>): NeoFormErrorMessage[] {
    const errorMessages: NeoFormErrorMessage[] = [];
    if (!errors) {
      return errorMessages;
    }

    Object.keys(errors).forEach((errorKey) => {
      const error = errors[errorKey];

      // Caso para validadores personalizados que devuelven { message: 'Mi mensaje', params: {...} }
      if (error && typeof error === 'object' && error.message) {
        errorMessages.push({
          key: errorKey, // Clave del error, opcional si se usa un mensaje ya traducido
          message: error.message,
          params: error.params, // Los parámetros se mantienen si el consumidor los usa
        });
      } else {
        // Para errores estándar de Angular (required, minlength, etc.) o validadores que solo devuelven true
        // Aquí se usaría la clave del error como el mensaje, y el desarrollador es responsable de traducirlo.
        errorMessages.push({
          key: errorKey, // Clave del error, opcional si se usa un mensaje ya traducido
          message: errorKey, // El desarrollador debe traducir 'required', 'minlength', etc.
          params: error, // Se pasan los parámetros originales del error de Angular
        });
      }
    });
    return errorMessages;
  }

  /**
   * Obtiene el mensaje de validación traducido o el mensaje por defecto para enviarlo a la vista
   * @param {Object} error - Objeto de error con clave y mensaje opcional
   * @property {string} error.key - Clave del error, como 'required', 'minlength', etc.
   * @property {string} [error.message] - Mensaje opcional que puede ser ya traducido o personalizado.
   * @returns {string} - Mensaje de error final, ya sea traducido o el mensaje por defecto.
   */
  getValidationMessage(error: NeoFormErrorMessage): string {
    const validatorKeys = this._translations?.validators
      ? (Object.keys(this._translations.validators) as Array<
          keyof typeof this._translations.validators
        >)
      : [];
    const key = error.key as string;
    const translated = validatorKeys.includes(
      key as keyof typeof this._translations.validators,
    )
      ? this._translations?.validators?.[
          key as keyof typeof this._translations.validators
        ]
      : undefined;
    return translated ?? error?.message ?? key;
  }
}
