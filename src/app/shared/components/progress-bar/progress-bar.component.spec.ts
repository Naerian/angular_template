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
