import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonGroupComponent } from './radio-button-group.component';
import { QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RadioButtonComponent } from '../radio-button.component';
import { InputsUtilsService } from '../../services/inputs-utils.service';

describe('RadioButtonGroupComponent', () => {
  let component: RadioButtonGroupComponent;
  let fixture: ComponentFixture<RadioButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioButtonGroupComponent],
      providers: [{ provide: FormControl, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set label', () => {
    component.label = 'Test Label';
    expect(component.label).toBe('Test Label');
  });

  it('should set hideLabel', () => {
    component.hideLabel = true;
    expect(component.hideLabel).toBeTrue();
  });

  it('should set direction', () => {
    component.direction = 'vertical';
    expect(component.direction).toBe('vertical');
  });

  it('should set inputSize', () => {
    component.inputSize = 's';
    expect(component.inputSize).toBe('s');
  });

  it('should set name', () => {
    component.name = 'TestName';
    expect(component.name).toBe('TestName');
  });

  it('should set disabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('should set selected', () => {
    const radioButton = { value: 'test' } as RadioButtonComponent;
    component.selected = radioButton;
    expect(component.selected).toBe(radioButton);
  });

  it('should set value', () => {
    component.value = 'test';
    expect(component.value).toBe('test');
  });

  it('should emit change event', () => {
    spyOn(component.change, 'emit');
    component.emitChangeEvent();
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should change value', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'onTouched');
    spyOn(component, 'emitChangeEvent');
    component.changeValue('test');
    expect(component.onChange).toHaveBeenCalledWith('test');
    expect(component.onTouched).toHaveBeenCalled();
    expect(component.emitChangeEvent).toHaveBeenCalled();
  });

  it('should write value', () => {
    component.writeValue('test');
    expect(component.value).toBe('test');
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

  it('should call createTitle on ngAfterViewInit', () => {
    spyOn(component, 'createTitle');
    component.ngAfterViewInit();
    expect(component.createTitle).toHaveBeenCalled();
  });

  it('should call updateRadioButtonsName on ngAfterViewInit if name is not set', () => {
    let _inputsUtilsService = fixture.debugElement.injector.get(InputsUtilsService);
    spyOn(component, 'updateRadioButtonsName');
    spyOn(_inputsUtilsService, 'createUniqueId').and.returnValue('testId');
    component.name = '';
    component.ngAfterViewInit();
    expect(component.updateRadioButtonsName).toHaveBeenCalled();
  });

  it('should call updateInputSizeRadioButtons on inputSize change', () => {
    spyOn(component, 'updateInputSizeRadioButtons');
    component.inputSize = 's';
    expect(component.updateInputSizeRadioButtons).toHaveBeenCalled();
  });

  it('should call updateRadioButtonsName on name change', () => {
    spyOn(component, 'updateRadioButtonsName');
    component.name = 'testName';
    expect(component.updateRadioButtonsName).toHaveBeenCalled();
  });

  it('should call disableRadioButtons on disabled change', () => {
    spyOn(component, 'disableRadioButtons');
    component.disabled = true;
    expect(component.disableRadioButtons).toHaveBeenCalled();
  });

  it('should call checkSelectedRadioButton on selected change', () => {
    spyOn(component, 'checkSelectedRadioButton');
    component.selected = { value: 'test' } as RadioButtonComponent;
    expect(component.checkSelectedRadioButton).toHaveBeenCalled();
  });

  it('should call updateSelectedRadioFromValue on value change', () => {
    spyOn(component, 'updateSelectedRadioFromValue');
    component.value = 'test';
    expect(component.updateSelectedRadioFromValue).toHaveBeenCalled();
  });
});
