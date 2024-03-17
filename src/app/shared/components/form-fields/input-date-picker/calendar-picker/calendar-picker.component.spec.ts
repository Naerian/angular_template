import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import moment from 'moment';
import { CalendarPickerComponent } from './calendar-picker.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('CalendarPickerComponent', () => {
  let component: CalendarPickerComponent;
  let fixture: ComponentFixture<CalendarPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        CalendarPickerComponent
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setDay', () => {
    component.setDay(moment());
  });

  it('initCalendar', () => {
    component.initCalendar();
  });

  it('prevMonth', () => {
    component.defaultDate = moment().format('YYYY-MM-DD');
    fixture.detectChanges();
    component.prevMonth();
  });

  it('nextMonth', () => {
    component.defaultDate = moment().format('YYYY-MM-DD');
    fixture.detectChanges();
    component.nextMonth();
  });

  it('isSameSelectedDay', () => {
    component.defaultDate = moment().format('YYYY-MM-DD');
    fixture.detectChanges();
    expect(component.isSameSelectedDay(moment())).toBeTrue();
  });

  it('isToday', () => {
    expect(component.isToday(moment())).toBeTrue();
  });

  it('chageViewMode years', () => {
    component.chageViewMode('years');
  });

  it('chageViewMode months', () => {
    component.chageViewMode('months');
  });

  it('changeMonth', () => {
    component._defaultDate.set(moment().format('YYYY-MM-DD'));
    component.changeMonth(3);
  });

  it('changeYear', () => {
    component._defaultDate.set(moment().format('YYYY-MM-DD'));
    component.changeYear('2021');
  });

  it('nextYears', () => {
    component.allYears.set(['2020', '2021', '2022']);
    component.nextYears();
  });

  it('prevYears', () => {
    component.allYears.set(['2020', '2021', '2022']);
    component.prevYears();
  });

  it('emitDateSelected', () => {
    spyOn(component.dateSelected, 'emit');
    component._defaultDate.set(moment().format('YYYY-MM-DD'));
    component.emitDateSelected(component._defaultDate(), true);
    expect(component.dateSelected.emit).toHaveBeenCalled();
  });
});
