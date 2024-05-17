import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TextAreaComponent } from './text-area.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { InputsUtilsService } from '../services/inputs-utils.service';

describe('TextAreaComponent', () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        TextAreaComponent,
        HttpClientModule,
        RouterTestingModule
      ]
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUniqueId on ngAfterViewInit if id is not set', () => {
    let _inputsUtilsService = fixture.debugElement.injector.get(InputsUtilsService);
    spyOn(_inputsUtilsService, 'createUniqueId').and.returnValue('testId');
    component.id = '';
    component.ngAfterViewInit();
    expect(_inputsUtilsService.createUniqueId).toHaveBeenCalled();
  });

  it('should set id and labelId if id is set', () => {
    component.id = 'testId';
    expect(component['_id']()).toBe('testId');
    expect(component['_labelId']()).toBe('label_testId');
  });

  it('should set value and emit change event on input', () => {
    spyOn(component.change, 'emit');
    component.onInput('test');
    expect(component.value).toBe('test');
    expect(component.change.emit).toHaveBeenCalledWith('test');
  });

  it('should call onTouched on blur', () => {
    spyOn(component, 'onTouched');
    component.onBlur();
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should write form value to the DOM element', () => {
    component.writeValue('test');
    expect(component.value).toBe('test');
  });

  it('should register on change', () => {
    const fn = jasmine.createSpy();
    component.registerOnChange(fn);
    component.onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register on touched', () => {
    const fn = jasmine.createSpy();
    component.registerOnTouched(fn);
    component.onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalse();
  });

  it("should pass InputDatePicker accessibility test", async () => {
    const fixture = TestBed.createComponent(TextAreaComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.placeholder = 'test';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.value = 'test';
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.autofocus = false;
    fixture.componentInstance.readonly = false;
    fixture.componentInstance.resize = false;
    fixture.componentInstance.maxlength = 100;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
