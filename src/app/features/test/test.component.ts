import { CommonModule, JsonPipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IColumnsFormat } from '@entities/table.entity';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormFieldsModule } from '@shared/components/form-fields/form-fields.module';
import { InputDatePickerComponent } from '@shared/components/form-fields/input-date-picker/input-date-picker.component';
import { MenuContextModule } from '@shared/components/menu-context/menu-context.module';
import { ModalOptionsEntity } from '@shared/components/modal/models/modal.entity';
import { ModalDialogService } from '@shared/components/modal/services/modal-dialog.service';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import {
  SidebarbarPanelEntity,
  SidebarbarPanelSize,
} from '@shared/components/sidebar-panel/models/sidebar-panel.entity';
import { SidebarPanelService } from '@shared/components/sidebar-panel/services/sidebar-panel.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TabsModule } from '@shared/components/tabs/tabs.module';
import { ThemeToggleModule } from '@shared/components/theme-toggle/theme-toggle.module';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'neo-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    FormsModule,
    SpinnerComponent,
    ProgressBarComponent,
    CardModule,
    TranslateModule,
    ThemeToggleModule,
    TabsModule,
    JsonPipe,
    PaginatorComponent,
    MenuContextModule,
    MatTableModule,
    MatSortModule,
    CalendarComponent,
    InputDatePickerComponent,
    ButtonComponent,
    FormFieldsModule,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent implements OnInit {
  // Columnas de ejemplo
  columnDefinitions = [
    {
      def: 'id',
      label: 'ID',
      visible: true,
    },
    {
      def: 'name',
      label: 'Name',
      visible: true,
    },
    {
      def: 'description',
      label: 'Description',
      visible: true,
    },
    {
      def: 'price',
      label: 'Price',
      visible: false,
    },
  ];

  showInfoTable: boolean = false;
  dateInfo1: any;
  dateInfo2: any;
  dateInfo3: any;
  dateInfo4: any;

  checkboxValue: boolean = false;
  radioButtonValue: string | null | number = 1;
  inputvalue: string = '';
  inputFormFieldValue: string = '';
  inputFormField2Value: string = '';
  selectValue: string = '';
  selectValueWithDefaultValue: string = '';
  selectMultipleValue: string[] = [];
  selectValueWithDefaultMultipleValue: string[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([
    { id: '1', name: 'One name', description: 'One', price: 1 },
    { id: '2', name: 'Two name', description: 'Two', price: 2 },
    { id: '3', name: 'Three name', description: 'Three', price: 2 },
    { id: '1', name: 'One name', description: 'One', price: 3 },
    { id: '2', name: 'Two name', description: 'Two', price: 5 },
    { id: '3', name: 'Three name', description: 'Three', price: 5 },
    { id: '1', name: 'One name', description: 'One', price: 6 },
    { id: '2', name: 'Two name', description: 'Two', price: 5 },
    { id: '3', name: 'Three name', description: 'Three', price: 45 },
    { id: '1', name: 'One name', description: 'One', price: 7 },
    { id: '2', name: 'Two name', description: 'Two', price: 45 },
    { id: '3', name: 'Three name', description: 'Three', price: 44 },
  ]);

  // Fecha actual para el calendario
  today = new Date();

  // Valor por defecto para el date picker
  datePickerValue: Date = new Date('2025/07/08');

  // Valor por defecto para el date picker de rango
  datePickerRangeValue: Date[] = [
    new Date('2025/07/08'),
    new Date('2025/07/15'),
  ];

  // Array de 5 fechas a partir de hoy para simular pasarle unas fechas predefinidas al calendario
  customDates: Date[] = [];

  // Array de fechas deshabilitadas para el calendario
  disabledDates: (string | Date)[] = [];

  public readonly testForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });

  public readonly testFormDateWeek = new FormGroup({
    dateWeek: new FormControl<string[]>([]),
  });

  public readonly testFormDateRange = new FormGroup({
    dateRange: new FormControl<string[]>([]),
  });

  public readonly testFormDate = new FormGroup({
    date: new FormControl<string>(''),
  });

  public readonly testFormRadioButton = new FormGroup({
    radioButtonControl: new FormControl<number>(2),
  });

  constructor(
    private readonly _sidebarPanelService: SidebarPanelService,
    private readonly _modalDialogService: ModalDialogService,
    private readonly _toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    // Inicializamos las fechas deshabilitadas para el componente "neo-calendar"
    this.setDisabledDates();

    // Inicializamos las fechas personalizadas para el componente "neo-calendar"
    this.setCustomDates();
  }

  setCustomDates() {
    const year = this.today.getFullYear();
    const month = this.today.getMonth(); // 0-based: enero = 0
    const startDay = 8; // o puedes usar today.getDate() si quieres empezar desde hoy
    this.customDates = Array.from(
      { length: 9 },
      (_, i) => new Date(year, month, startDay + i),
    );
  }

  setDisabledDates() {
    // Creamos un array de 4 fechas deshabilitadas para el mes actual de forma aleatoria
    this.disabledDates = Array.from({ length: 4 }, () => {
      const randomDay = Math.floor(Math.random() * 28) + 1; // Días del 1 al 28 para evitar problemas de mes
      return moment().date(randomDay).toDate();
    });
  }

  columnsChanged(columns: IColumnsFormat[]) {
    this.columnDefinitions = columns;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
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
        applications that live on the web, mobile, or the desktop</p>`,
      cancelText: 'Cancelar',
      confirmText: 'Aceptar',
      canBeClosed: true,
    };

    this._modalDialogService.open(options);
    this._modalDialogService.afterClosed().subscribe((confirmed) => {
      if (confirmed) alert('Modal aceptado');
      else alert('Modal cancelado');
    });
  }

  checkboxChange(status: any) {
    console.log('onChangeCheckBox: ', status);
  }

  checkboxChangeNM() {
    console.log('checkboxChangeNM: ', this.checkboxValue);
  }

  selectChangeNM() {
    console.log('selectChangeNM: ', this.selectValue);
  }

  selectMultipleChangeNM() {
    console.log('selectMultipleChangeNM: ', this.selectMultipleValue);
  }

  selectWithDefaultValue(value: any) {
    this.selectValueWithDefaultValue = value;
    console.log('selectWithDefaultValue: ', this.selectValueWithDefaultValue);
  }

  selectWithDefaultMultipleValue(value: any) {
    this.selectValueWithDefaultMultipleValue = value;
    console.log(
      'selectWithDefaultValue: ',
      this.selectValueWithDefaultMultipleValue,
    );
  }

  inputChange(value: string) {
    console.log('inputChange: ', value);
  }

  radioChange(value: any) {
    console.log('radioChange: ', value);
  }

  radioChangeNG() {
    console.log('radioChangeNG: ', this.radioButtonValue);
  }

  openModalComponent() {
    const options: ModalOptionsEntity = {
      canBeClosed: true,
    };

    this._modalDialogService.open(options, CalendarComponent);
  }

  filsFromInput(files: FileList) {
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);
      console.log('Archivos seleccionados:', fileNames.join(', '));
    } else {
      console.log('No se seleccionó ningún archivo');
    }
  }
}
