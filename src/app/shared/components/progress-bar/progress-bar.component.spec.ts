import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from './progress-bar.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ProgressBarComponent,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate progress value and width for progress number', () => {
    component.progressNumber = 50;
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('50 %');
    expect(component.progressBarWidth).toEqual(50);
  });

  it('should calculate progress value and width for progress split', () => {
    component.progressSplit = [3, 5];
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('3 / 5');
    expect(component.progressBarWidth).toEqual(60);
  });

  it('should set progress value and width to 0 when progress number is NaN', () => {
    component.progressNumber = NaN;
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('0 %');
    expect(component.progressBarWidth).toEqual(0);
  });

  it('should set progress value and width to 0 when progress split values are NaN', () => {
    component.progressSplit = [NaN, NaN];
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('0 / 0');
    expect(component.progressBarWidth).toEqual(0);
  });

  it('should set progress value to 0 when progress number is -1', () => {
    component.progressNumber = -1;
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('-1 / -1');
  });

  it('should set progress value to 0/0 when progress split is not provided', () => {
    component.progressValueCalculation();
    expect(component.progressValue).toEqual('-1 / -1');
  });

  it('should render correctly when passed @Input value percent', () => {
    component.progressNumber = 10;
    component.progressValueCalculation();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div').textContent).toEqual(
      '10 %'
    );
  });

  it('should render correctly when passed @Input value parts', () => {
    component.progressSplit = [11, 20];
    component.progressValueCalculation();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div').textContent).toEqual(
      '11 / 20'
    );
  });
});
