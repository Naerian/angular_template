import { BreadcrumComponent } from './../../shared/components/breadcrum/breadcrum.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IColumnsFormat } from '@entities/table.entity';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FilterColumnsTableComponent } from '@shared/components/filter-columns-table/filter-columns-table.component';
import { SidebarbarPanelEntity, SidebarbarPanelSize } from '@shared/components/sidebar-panel/models/sidebar-panel.entity';
import { SidebarPanelService } from '@shared/components/sidebar-panel/services/sidebar-panel.service';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ModalDialogService } from '@shared/components/modal/services/modal-dialog.service';
import { ModalOptionsEntity } from '@shared/components/modal/models/modal.entity';
import { MatSortModule } from '@angular/material/sort';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { ToastrService } from 'ngx-toastr';
import { MenuContextModule } from '@shared/components/menu-context/menu-context.module';
import { TabsModule } from '@shared/components/tabs/tabs.module';
import { ThemeToggleModule } from '@shared/components/theme-toggle/theme-toggle.module';
import { CardModule } from '@shared/components/card/card.module';
import { FormFields } from '@shared/components/form-fields/form-fields.module';
import { CalendarDatePickerModule } from '@shared/components/form-fields/input-date-picker/calendar-date-picker.module';
import { CalendarPickerComponent } from '@shared/components/form-fields/input-date-picker/calendar-picker/calendar-picker.component';

@Component({
  selector: 'neo-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumComponent, FormsModule, SpinnerComponent, ProgressBarComponent, CardModule, TranslateModule, ThemeToggleModule, TabsModule, RouterOutlet, JsonPipe, PaginatorComponent, MenuContextModule, FilterColumnsTableComponent, MatTableModule, MatSortModule, CalendarDatePickerModule, ButtonComponent, FormFields],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {

  // Columnas de ejemplo
  columnDefinitions = [
    {
      def: "id",
      label: "ID",
      visible: true
    },
    {
      def: "name",
      label: "Name",
      visible: true
    },
    {
      def: "description",
      label: "Description",
      visible: true
    },
    {
      def: "price",
      label: "Price",
      visible: false
    }
  ];

  showInfoTable: boolean = false;
  dateInfo1: any;
  dateInfo2: any;
  dateInfo3: any;

  checkboxValue: boolean = false;
  radioButtonValue: string | null | number = null;
  inputvalue: string = '';
  selectValue: string = '';
  selectValueWithDefaultValue: string = '';
  selectMultipleValue: string[] = [];
  selectValueWithDefaultMultipleValue: string[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([
    { id: "1", name: "One name", description: "One", price: 1 },
    { id: "2", name: "Two name", description: "Two", price: 2 },
    { id: "3", name: "Three name", description: "Three", price: 2 },
    { id: "1", name: "One name", description: "One", price: 3 },
    { id: "2", name: "Two name", description: "Two", price: 5 },
    { id: "3", name: "Three name", description: "Three", price: 5 },
    { id: "1", name: "One name", description: "One", price: 6 },
    { id: "2", name: "Two name", description: "Two", price: 5 },
    { id: "3", name: "Three name", description: "Three", price: 45 },
    { id: "1", name: "One name", description: "One", price: 7 },
    { id: "2", name: "Two name", description: "Two", price: 45 },
    { id: "3", name: "Three name", description: "Three", price: 44 }
  ]);

  public readonly testForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private readonly _sidebarPanelService: SidebarPanelService,
    private readonly _modalDialogService: ModalDialogService,
    private readonly _toastrService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  columnsChanged(columns: IColumnsFormat[]) {
    this.columnDefinitions = columns;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => cd.visible).map(cd => cd.def);
  }

  buttonClicked() {
    alert('Botón pulsado');
  }

  toastSuccess() {
    this._toastrService.success('Toast de éxito', 'Título de éxito');
  }

  toastError() {
    this._toastrService.error('Toast de error', 'Título de error');
  }

  toastWarning() {
    this._toastrService.warning('Toast de warning', 'Título de warning');
  }

  openSidebar() {
    this._sidebarPanelService.open({
      title: 'Test sidebar',
      size: SidebarbarPanelSize.SMALL,
    } as SidebarbarPanelEntity);
  }

  openModal() {
    const options: ModalOptionsEntity = {
      title: 'Título de prueba',
      message: `<h3>Develop across all platforms</h3>
      <p>Learn one way to build applications with Angular and reuse your code and abilities to build
        apps for any deployment target. For web, mobile web, native mobile and native desktop.</p>

      <h3>Speed &amp; Performance</h3>
      <p>Achieve the maximum speed possible on the Web Platform today, and take it further, via Web
        Workers and server-side rendering. Angular puts you in control over scalability. Meet huge
        data requirements by building data models on RxJS, Immutable.js or another push-model.</p>

      <h3>Incredible tooling</h3>
      <p>Build features quickly with simple, declarative templates. Extend the template language with
        your own components and use a wide array of existing components. Get immediate Angular-specific
        help and feedback with nearly every IDE and editor. All this comes together so you can focus
        on building amazing apps rather than trying to make the code work.</p>

      <h3>Loved by millions</h3>
      <p>From prototype through global deployment, Angular delivers the productivity and scalable
        infrastructure that supports Google's largest applications.</p>

      <h3>What is Angular?</h3>

      <p>Angular is a platform that makes it easy to build applications with the web. Angular
        combines declarative templates, dependency injection, end to end tooling, and integrated
        best practices to solve development challenges. Angular empowers developers to build
        applications that live on the web, mobile, or the desktop</p>

      <h3>Architecture overview</h3>

      <p>Angular is a platform and framework for building client applications in HTML and TypeScript.
      Angular is itself written in TypeScript. It implements core and optional functionality as a
      set of TypeScript libraries that you import into your apps.</p>

      <p>The basic building blocks of an Angular application are NgModules, which provide a compilation
      context for components. NgModules collect related code into functional sets; an Angular app is
      defined by a set of NgModules. An app always has at least a root module that enables
      bootstrapping, and typically has many more feature modules.</p>

      <p>Components define views, which are sets of screen elements that Angular can choose among and
      modify according to your program logic and data. Every app has at least a root component.</p>

      <p>Components use services, which provide specific functionality not directly related to views.
      Service providers can be injected into components as dependencies, making your code modular,
      reusable, and efficient.</p>

      <p>Both components and services are simply classes, with decorators that mark their type and
      provide metadata that tells Angular how to use them.</p>

      <p>The metadata for a component class associates it with a template that defines a view. A
      template combines ordinary HTML with Angular directives and binding markup that allow Angular
      to modify the HTML before rendering it for display.</p>

      <p>The metadata for a service class provides the information Angular needs to make it available
      to components through Dependency Injection (DI).</p>

      <p>An app's components typically define many views, arranged hierarchically. Angular provides
      the Router service to help you define navigation paths among views. The router provides
      sophisticated in-browser navigational capabilities.</p>`,
      cancelText: 'Cancelar',
      confirmText: 'Aceptar',
      canBeClosed: true
    };

    this._modalDialogService.open(options);
    this._modalDialogService.afterClosed()
      .subscribe((confirmed) => {
        if (confirmed)
          alert('Modal aceptado');
        else
          alert('Modal cancelado');
      });
  }

  checkboxChange(status: any) {
    console.log("onChangeCheckBox: ", status);
  }

  checkboxChangeNM() {
    console.log("checkboxChangeNM: ", this.checkboxValue);
  }

  selectChangeNM() {
    console.log("selectChangeNM: ", this.selectValue);
  }

  selectMultipleChangeNM() {
    console.log("selectMultipleChangeNM: ", this.selectMultipleValue);
  }

  selectWithDefaultValue(value: any) {
    this.selectValueWithDefaultValue = value;
    console.log("selectWithDefaultValue: ", this.selectValueWithDefaultValue);
  }

  selectWithDefaultMultipleValue(value: any) {
    this.selectValueWithDefaultMultipleValue = value;
    console.log("selectWithDefaultValue: ", this.selectValueWithDefaultMultipleValue);
  }

  inputChange(value: string) {
    console.log("inputChange: ", value);
  }

  radioChange(value: any) {
    console.log("radioChange: ", value);
  }

  radioChangeNG() {
    console.log("radioChangeNG: ", this.radioButtonValue);
  }

  openModalComponent() {

    const options: ModalOptionsEntity = {
      canBeClosed: true
    };

    this._modalDialogService.open(options, CalendarPickerComponent);
  }

}
