import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsComponent } from './options.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from '../select.module';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        SelectModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a selected Input', () => {
    component.selected = true;
    expect(component.selected).toBeTruthy();
  });

  it('should have a div tag', () => {
    const div = fixture.nativeElement.querySelector('div');
    expect(div).toBeTruthy();
  });
});
