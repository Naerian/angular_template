import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { IColumnsFormat } from '@entities/table.entity';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[resizable-column]',
  standalone: true,
})
export class ResizeColumnDirective implements OnInit {
  @Input('resizable-column') resizable: boolean = true;
  @Input() index!: number;
  @Input() column!: IColumnsFormat;

  private startX!: number;
  private startWidth!: number;
  private columnElement!: HTMLElement;
  private table!: HTMLElement;
  private pressed!: boolean;

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private readonly _translateService: TranslateService,
  ) {
    this.columnElement = this.el.nativeElement;
  }

  ngAfterContentChecked(): void {
    if (this.column && this.column.width) this.setColumnSize(this.column.width);
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.columnElement);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      // Creamos el resizer y lo añadimos al DOM
      const resizer_holder = this.renderer.createElement('div');
      const resizer_hover = this.renderer.createElement('div');
      resizer_holder.appendChild(resizer_hover);
      resizer_holder.setAttribute(
        'title',
        this._translateService.instant('TABLE.RESIZE_COLUMN'),
      );
      this.renderer.addClass(resizer_holder, 'resizer');
      this.renderer.addClass(resizer_hover, 'resizer-hover');
      this.renderer.appendChild(this.columnElement, resizer_holder);

      // Le agregamos los eventos para redimensionar la columna
      this.renderer.listen(resizer_holder, 'click', this.onClick);
      this.renderer.listen(resizer_holder, 'mousedown', this.onMouseDown);
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onClick = (event: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
  };

  onMouseDown = (event: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.columnElement.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.pressed && event.buttons) {
      // Add class to table to prevent text selection
      this.renderer.addClass(this.table, 'resizing');

      // Calculate width of column
      let width = this.startWidth + (event.pageX - this.startX);

      // Set min and max width
      this.setColumnSize(width);
    }
  };

  onMouseUp = (event: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };

  setColumnSize(width: string | number) {
    const tableCells = Array.from(
      this.table.querySelectorAll('.mat-mdc-row'),
    ).map((row: any) => row.querySelectorAll('.mat-mdc-cell').item(this.index));

    // Set table header width
    this.renderer.setStyle(this.columnElement, 'min-width', `${width}px`);
    this.renderer.setStyle(this.columnElement, 'max-width', `${width}px`);
    this.renderer.setStyle(this.columnElement, 'width', `${width}px`);
    this.column.width = width;

    // Set table cells width
    for (const cell of tableCells) {
      this.renderer.setStyle(cell, 'min-width', `${width}px`);
      this.renderer.setStyle(cell, 'max-width', `${width}px`);
      this.renderer.setStyle(cell, 'width', `${width}px`);
    }
  }
}
