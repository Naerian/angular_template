import {
  Directive,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy,
  Optional,
  inject,
  Injector,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[showClear]',
  standalone: true,
})
export class ShowClearFieldDirective implements OnInit, OnDestroy {
  @Input('showClear') showClear: boolean = false; // Input para activar / desactivar la directiva
  @Input() inputSize: string = 'm';
  @Input() clearIcon: string = 'ri-close-circle-fill'; // Icono por defecto
  @Input() hideOnEmpty: boolean = true; // Ocultar si el campo está vacío

  @Optional() private ngControl: NgControl | null = null;

  // Evento para emitir cuando se hace clic en el botón de limpiar
  @Output() clear = new EventEmitter<void>();

  private clearButton!: HTMLElement;
  private subscription?: Subscription;

  // Inyectamos las traducciones
  protected _translations: NeoUITranslations = inject(NEOUI_TRANSLATIONS);

  // Inyectamos las dependencias necesarias
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly injector = inject(Injector);

  ngOnInit() {
    // Intentamos obtener NgControl, pero es opcional
    this.ngControl = this.injector.get(NgControl, null);

    this.clearButton = this.renderer.createElement('i');
    this.renderer.addClass(this.clearButton, 'neo-clear-field-button');
    this.renderer.addClass(
      this.clearButton,
      'neo-clear-field-button--' + this.inputSize,
    );
    this.renderer.addClass(this.clearButton, this.clearIcon); // Añadir clase del icono (ej: Remixer Icon)
    this.renderer.setStyle(this.clearButton, 'cursor', 'pointer');
    this.renderer.setStyle(this.clearButton, 'position', 'absolute');
    this.renderer.setStyle(this.clearButton, 'top', '50%');
    this.renderer.setStyle(this.clearButton, 'right', '0'); // Ajustar según el diseño del input
    this.renderer.setStyle(this.clearButton, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.clearButton, 'z-index', '2'); // Para que esté por encima del input
    this.renderer.setStyle(this.clearButton, 'display', 'none'); // Oculto por defecto

    // Añadimos título al botón para accesibilidad
    const btnTitle = this._translations?.clearButton || '';
    this.renderer.setProperty(this.clearButton, 'title', btnTitle);

    // Añadimos atributos ARIA para accesibilidad
    this.renderer.setAttribute(this.clearButton, 'aria-label', btnTitle);
    this.renderer.setAttribute(this.clearButton, 'role', 'button');
    this.renderer.setAttribute(this.clearButton, 'tabindex', '0');

    // Si el elemento tiene algún hijo, lo añadimos al final del elemento
    // Si no, lo añadimos directamente al padre (porque se intuye que es un input)
    if (this.el.nativeElement.children.length > 0) {
      this.renderer.appendChild(
        this.el.nativeElement,
        this.clearButton,
      );
    } else {
      this.renderer.appendChild(
        this.el.nativeElement.parentNode,
        this.clearButton,
      );
    }

    // Añadir listener para el clic en el botón de limpiar
    this.renderer.listen(this.clearButton, 'click', (event) => {
      event.stopPropagation();
      this.clear.emit();
      this.updateButtonVisibility();
    });

    // Añadimos evento de teclado para accesibilidad
    this.renderer.listen(this.clearButton, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === 'Space') {
        event.stopPropagation();
        this.clear.emit();
        this.updateButtonVisibility();
      }
    });

    // Llamamos a onValueChanged para inicializar la visibilidad del botón
    if (this.ngControl && this.ngControl.control) {
      this.onValueChanged();
    } else {
      this.updateButtonVisibility();
    }
  }

  ngAfterViewInit(): void {
    this.updateButtonVisibility();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.clearButton) {
      this.renderer.removeChild(this.el.nativeElement, this.clearButton);
    }
  }

  /**
   * Método para actualizar la visibilidad del botón de limpiar
   * basado en el valor del control.
   */
  onValueChanged() {
    this.subscription = this.ngControl?.control?.valueChanges.subscribe(() => {
      this.updateButtonVisibility();
    });
  }

  private updateButtonVisibility() {
    const value = this.ngControl?.value;
    if (this.clearButton) {
      const isValueEmpty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      if (this.showClear && this.hideOnEmpty && isValueEmpty) {
        this.renderer.setStyle(this.clearButton, 'display', 'none');
      } else if (this.showClear && !isValueEmpty) {
        this.renderer.setStyle(this.clearButton, 'display', 'block');
      } else if (this.showClear && !this.hideOnEmpty) {
        // Si no se oculta en vacío, siempre se muestra si showClear es true
        this.renderer.setStyle(this.clearButton, 'display', 'block');
      } else {
        this.renderer.setStyle(this.clearButton, 'display', 'none');
      }
    }
  }
}
