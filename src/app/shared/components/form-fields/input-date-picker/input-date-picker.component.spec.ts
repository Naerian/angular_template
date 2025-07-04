import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import moment from 'moment';
import { InputDatePickerComponent } from './input-date-picker.component';
import { CalendarDatePickerModule } from './input-date-picker.module';

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
        RouterTestingModule,
      ],
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set id', () => {
    component.id = 'testId';
    expect(component.id).toBe('testId');
  });

  it('should set disabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('should set value', () => {
    component.value = '2021-12-31';
    expect(component.value).toBe('2021-12-31');
  });

  it('should emit dateSelected event on setCalendarValue', () => {
    spyOn(component.dateSelected, 'emit');
    const value = { date: moment(new Date()).format('YYYY-MM-DD') };
    component.setCalendarValue(value);
    expect(component.dateSelected.emit).toHaveBeenCalledWith(
      component.formatDate(component.format, value.date),
    );
  });

  it('should emit change event on setCalendarValue', () => {
    spyOn(component.change, 'emit');
    const value = { date: moment(new Date()).format('YYYY-MM-DD') };
    component.setCalendarValue(value);
    expect(component.change.emit).toHaveBeenCalledWith(
      component.formatDate(component.format, value.date),
    );
  });

  it('should call closeCalendar on _onKeydownHandler', () => {
    spyOn(component, 'closeCalendar');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component._onKeydownHandler(event);
    expect(component.closeCalendar).toHaveBeenCalled();
  });

  it('should open calendar on toggleCalendar', () => {
    component.isDatePickerOpened.set(false);
    component.disabled = false;
    const event = new Event('click');
    component.toogleCalendar(event);
    expect(component.isDatePickerOpened()).toBeTrue();
  });

  it('should close calendar on toggleCalendar', () => {
    component.isDatePickerOpened.set(true);
    const event = new Event('click');
    component.toogleCalendar(event);
    expect(component.isDatePickerOpened()).toBeFalse();
  });

  it('should register on change', () => {
    const fn = () => {};
    component.registerOnChange(fn);
    expect(component.onChange).toBe(fn);
  });

  it('should register on touched', () => {
    const fn = () => {};
    component.registerOnTouched(fn);
    expect(component.onTouched).toBe(fn);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('should pass InputDatePicker accessibility test', async () => {
    const fixture = TestBed.createComponent(InputDatePickerComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.placeholder = 'test';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.value = 'test';
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.autofocus = false;
    fixture.componentInstance.readonly = false;
    fixture.componentInstance.autocomplete = 'off';
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
