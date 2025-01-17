import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FormValidationsService } from './form-validations/form-validations.service';

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
  @Input() ngModelControl!: NgModel | null;

  errors = signal<{ message: string; params?: any }[]>([]);
  KEY_TRANSLATION_PREFIX = 'VALIDATION'; // Prefijo de las claves de traducción. Ejemplo: VALIDATION.REQUIRED

  _validationService = inject(FormValidationsService);

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
  }

  /**
   * Obtiene los mensajes de error de un control de formulario reactivo.
   */
  errorMessagesFromControl() {
    if (this.control?.errors) {
      this.errors.set(this.getErrorMessages(this.control.errors));
    } else {
      this.errors.set([]);
    }
  }

  /**
   * Obtiene los mensajes de error de un control `NgModel`.
   */
  errorMessagesFromNgModel() {
    if (this.ngModelControl?.control?.errors) {
      this.errors.set(
        this.getErrorMessages(this.ngModelControl.control.errors),
      );
    } else {
      this.errors.set([]);
    }
  }

  /**
   * Genera un array de mensajes de error.
   */
  private getErrorMessages(
    errors: Record<string, any>,
  ): { message: string; params?: any }[] {
    return Object.keys(errors).map((validatorName) => {
      const errorMessage = this.convertToTranslationKey(validatorName);
      const params = errors[validatorName]; // Obtén los parámetros del error
      return { message: errorMessage, params };
    });
  }

  /**
   * Función para convertir un mensaje de error en una cadena de traducción.
   */
  convertToTranslationKey(errorKey: string): string {
    return errorKey
      .replace(/([a-z])([A-Z])/g, '$1_$2') // Agregar un guion bajo entre letras minúsculas y mayúsculas
      .toUpperCase(); // Convertir toda la cadena a mayúsculas
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
