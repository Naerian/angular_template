import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InputComponent } from './input.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { InputsUtilsService } from '../services/inputs-utils.service';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        InputComponent,
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [InputsUtilsService]
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
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

  it('should set value for number type', () => {
    component.type = 'number';
    component.writeValue('10');
    expect(component._value()).toBe('10');
  });

  it('should set value for text type', () => {
    component.type = 'text';
    component.writeValue('Test');
    expect(component._value()).toBe('Test');
  });

  it('should call registerOnChange', () => {
    const fn = () => { };
    spyOn(component, 'registerOnChange');
    component.registerOnChange(fn);
    expect(component.registerOnChange).toHaveBeenCalledWith(fn);
  });

  it('should call registerOnTouched', () => {
    const fn = () => { };
    spyOn(component, 'registerOnTouched');
    component.registerOnTouched(fn);
    expect(component.registerOnTouched).toHaveBeenCalledWith(fn);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it("should pass Input Text accessibility test", async () => {
    const fixture = TestBed.createComponent(InputComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.placeholder = 'test';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.type = 'text';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.value = 'test';
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.autofocus = false;
    fixture.componentInstance.readonly = false;
    fixture.componentInstance.minlength = 0;
    fixture.componentInstance.maxlength = 100;
    fixture.componentInstance.autocomplete = 'off';
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
