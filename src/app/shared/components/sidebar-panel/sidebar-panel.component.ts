import { Component, ComponentRef, HostListener, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, WritableSignal, signal } from "@angular/core";
import { DEFAULT_POSITION, DEFAULT_SIZE, SidebarbarPanelEntity, SidebarbarPanelPosition, SidebarbarPanelSize } from "./models/sidebar-panel.entity";
import { SidebarPanelService } from "./services/sidebar-panel.service";
import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { EscapeKeyDirective } from "@shared/directives/escape-key.directive";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { FADE_IN_OUT_PANEL } from "./animations/fade-in-out.animation";
import { SLIDE_BY_POSITION } from "./animations/slide-by-position.animation";

/**
 * @name
 * neo-sidebar-panel
 * @description
 * Componente para crear un panel lateral mediante el servicio `sidebar-panel.service`
 * @example
 * <neo-sidebar-panel></neo-sidebar-panel>
 */
@Component({
  selector: "neo-sidebar-panel",
  templateUrl: "./sidebar-panel.component.html",
  styleUrls: ["./sidebar-panel.component.scss"],
  animations: [FADE_IN_OUT_PANEL, SLIDE_BY_POSITION],
  standalone: true,
  imports: [CommonModule, A11yModule, TranslateModule, CdkScrollable],
  encapsulation: ViewEncapsulation.None
})
export class SidebarPanelComponent implements OnInit {

  @ViewChild("content", { read: ViewContainerRef }) public panelContentRef!: ViewContainerRef;

  LEFT_POSITION = SidebarbarPanelPosition.LEFT;
  RIGHT_POSITION = SidebarbarPanelPosition.RIGHT;
  TOP_POSITION = SidebarbarPanelPosition.TOP;
  BOTTOM_POSITION = SidebarbarPanelPosition.BOTTOM;

  public isPanelVisible: WritableSignal<boolean> = signal(false);
  public size: WritableSignal<SidebarbarPanelSize> = signal(DEFAULT_SIZE);
  public position: WritableSignal<SidebarbarPanelPosition> = signal(DEFAULT_POSITION);
  public title: WritableSignal<string> = signal('');
  public classes: WritableSignal<string[]> = signal([]); // Para poder añadir clases extras al panel

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape')
      this.close();
  }

  constructor(
    private _sidebarPanelService: SidebarPanelService
  ) { }

  ngOnInit(): void {

    /**
     * Escuchamos si el panel es visible o no
     */
    this._sidebarPanelService.isPanelVisible()
      .subscribe(
        (isVisible: boolean) => {
          this.isPanelVisible.set(isVisible);
        }
      );

    /**
     * Escuchamos si el contenido del panel cambia
     */
    this._sidebarPanelService.panelContentChanged()
      .subscribe(
        (data: SidebarbarPanelEntity | null) => {
          if (this.isPanelVisible())
            this.setPanelContent(data);
        }
      );
  }

  /**
   * Método para cerrar el panel
   */
  close(): void {
    this._sidebarPanelService.close();
  }

  /**
   * Método para establecer el contenido del panel
   */
  private setPanelContent(content: SidebarbarPanelEntity | null = null) {

    // Si no hay contenido, intentamos obtenerlo del servicio
    if (!content || content === null)
      content = this._sidebarPanelService.getPanelContent();

    // Si no hay contenido aún así, limpiamos el panel y salimos
    if (!content || content === null) {
      this.size.set(DEFAULT_SIZE);
      this.position.set(DEFAULT_POSITION);
      this.title.set('');
      this.classes.set([]);
      this.panelContentRef?.clear();
      return;
    }

    // Establecemos las opciones del sidebar, si es que lleva alguna
    this.size.set(content.size || DEFAULT_SIZE);
    this.position.set(content.position || DEFAULT_POSITION);
    this.title.set(content.title || '');
    this.classes.set(content.classes || []);

    // Si hay componente asignado, lo mostramos en el panel y aplicamos las opciones que tenga
    if (content?.component) {

      this.panelContentRef?.clear();
      const componentCreated: ComponentRef<any> = this.panelContentRef?.createComponent(content.component);
      componentCreated?.location?.nativeElement?.classList.add('sidebar-panel__host');

      if (content?.inputs && content.inputs.length > 0) {
        content?.inputs.forEach((input) => {
          componentCreated.instance[input.name] = input.value;
        });
      }
    }

  }

}
