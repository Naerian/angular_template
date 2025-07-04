import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

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
        CalendarComponent,
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
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

  it('chageViewMode years', () => {
    component.chageViewMode('years');
  });

  it('chageViewMode months', () => {
    component.chageViewMode('months');
  });
});
