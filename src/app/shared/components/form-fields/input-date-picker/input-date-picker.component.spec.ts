import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InputDatePickerComponent } from './input-date-picker.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import moment from 'moment';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarDatePickerModule } from './calendar-date-picker.module';

describe('DatePickerComponent', () => {
  let component: InputDatePickerComponent;
  let fixture: ComponentFixture<InputDatePickerComponent>;
  let e: Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        CalendarDatePickerModule,
        HttpClientModule,
        OverlayModule,
        RouterTestingModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setCalendarValue', () => {
    component.setCalendarValue({ date: moment(new Date()).format('YYYY-MM-DD') });
  });

  it('formatDate', () => {
    component.formatDate('', null);
  });

  it('toogleCalendar', () => {
    var eventVar = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.toogleCalendar(eventVar);
  });

  it('toogleCalendar isDatePickerOpened', () => {
    var eventVar = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.isDatePickerOpened.set(true);
    component.toogleCalendar(eventVar);
  });

  it('closeCalendar', () => {
    component.closeCalendar();
  });

  it('writeValue', () => {
    component.writeValue(null);
  });

  it('writeValue value', () => {
    component.writeValue('tests');
  });

  it('registerOnChange', () => {
    component.registerOnChange('tests');
  });

  it('registerOnTouched', () => {
    component.registerOnTouched('tests');
  });

  it('setDisabledState', () => {
    component.setDisabledState(true);
  });
});
