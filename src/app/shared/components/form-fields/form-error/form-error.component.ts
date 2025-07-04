import { CommonModule } from '@angular/common';
import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormGroup, NgModel } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

/**
 * @name
 * neo-form-error
 * @description
 * Componente que muestra mensajes de error para un control de formulario,
 * ya sea reactivo o basado en plantillas mediante `NgModel`.
 * @example
 * <!-- Uso con Reactive Forms -->
 * <neo-form-error [control]="form.get('nombreCampo')"></neo-form-error>
 * <!-- Uso con Template-Driven Forms -->
 * <input [(ngModel)]="campo" name="campo" #campoNgModel="ngModel" />
 * <neo-form-error [ngModelControl]="campoNgModel"></neo-form-error>
 * <!-- Uso con FormGroup para validaciones grupales (pj: "dateRangeValidator", donde se comparan dos campos) -->
 * <neo-form-error [control]="form.get('nombreCampo')" [formGroup]="formGroup" controlName="campo"></neo-form-error>
 */
@Component({
  selector: 'neo-form-error',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() controlName!: string; // Nombre del campo asociado, por ejemplo 'fechaInicio'
  @Input() formGroup!: FormGroup | null;
  @Input() ngModelControl!: NgModel | null;

  errors = signal<{ message: string; params?: any }[]>([]);
  KEY_TRANSLATION_PREFIX = 'VALIDATOR';

  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    if (this.control) {
      this.control.statusChanges
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.errorMessagesFromControl();
        });
    }

    if (this.ngModelControl) {
      this.ngModelControl.statusChanges
        ?.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.errorMessagesFromNgModel();
        });
    }

    // También nos suscribimos a cambios del formGroup (por validaciones cruzadas)
    if (this.formGroup) {
      this.formGroup.statusChanges
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.errorMessagesFromFormGroup();
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Función para convertir un mensaje de error en una cadena de traducción.
   */
  private convertToTranslationKey(errorKey: string): string {
    return errorKey.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase(); // Agregar un guion bajo entre letras minúsculas y mayúsculas
  }

  /**
   * Errores del control individual.
   */
  private errorMessagesFromControl() {
    const controlErrors = this.control?.errors ?? {};
    this.errors.set(this.getErrorMessages(controlErrors));
  }

  /**
   * Errores de un control NgModel (template-driven forms).
   */
  private errorMessagesFromNgModel() {
    const modelErrors = this.ngModelControl?.control?.errors ?? {};
    this.errors.set(this.getErrorMessages(modelErrors));
  }

  /**
   * Errores que provienen del FormGroup (validaciones cruzadas).
   */
  private errorMessagesFromFormGroup() {
    if (!this.formGroup || !this.controlName) return;

    const groupErrors = this.formGroup.errors ?? {};
    const relatedErrors: Record<string, any> = {};

    Object.entries(groupErrors).forEach(([errorKey, errorValue]) => {
      if (typeof errorValue === 'object' && errorKey === this.controlName)
        relatedErrors[errorKey] = errorValue;
    });

    const controlErrors = this.control?.errors ?? {};
    this.errors.set(
      this.getErrorMessages({ ...controlErrors, ...relatedErrors }),
    );
  }

  /**
   * Genera un array de mensajes de error.
   */
  private getErrorMessages(
    errors: Record<string, any>,
  ): { message: string; params?: any }[] {
    return Object.keys(errors).map((errorKey) => {
      const error = errors[errorKey];

      // Si el error es un objeto con un mensaje (como en los validadores grupales)
      if (error?.message)
        return {
          message: this.convertToTranslationKey(error.message),
          params: error,
        };

      // Si no tiene 'message', entonces es un error más simple (ejemplo: required, minLength, etc.)
      const translatedKey = this.convertToTranslationKey(errorKey);
      return { message: translatedKey, params: error };
    });
  }
}
