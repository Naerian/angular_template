import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonComponent } from './radio-button.component';
import { ElementRef } from '@angular/core';
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input size', () => {
    component.inputSize = 's';
    expect(component.inputSize).toBe('s');
  });

  it('should set id and labelId', () => {
    component.id = 'testId';
    expect(component['_id']()).toBe('testId');
    expect(component['_labelId']()).toBe('label_testId');
  });

  it('should set value', () => {
    component.value = 'test';
    expect(component.value).toBe('test');
  });

  it('should set disabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('should set name', () => {
    component.name = 'testName';
    expect(component.name).toBe('testName');
  });

  it('should set checked', () => {
    component.checked = true;
    expect(component.checked).toBeTrue();
  });

  it('should create title', () => {
    component.radioButtonContent = { nativeElement: { innerHTML: '<div>Test</div>' } } as ElementRef;
    component.createTitle();
    expect(component['_title']()).toBe('Test');
  });

  it('should create unique name', () => {
    component.createUniqueName();
    expect(component.name).toBeTruthy();
  });

  it('should update size', () => {
    component.radioGroup = { inputSize: 's' } as RadioButtonGroupComponent;
    component.updateSize();
    expect(component.inputSize).toBe('s');
  });

  it('should create unique id', () => {
    component.createUniqueId();
    expect(component.id).toBeTruthy();
  });

  it('should emit change event', () => {
    spyOn(component.change, 'emit');
    component.value = 'test';
    component['_emitChangeEvent']();
    expect(component.change.emit).toHaveBeenCalledWith('test');
  });

  it('should handle onChangeRadioButton', () => {
    spyOn(component, '_emitChangeEvent');
    component.onChangeRadioButton(new Event('click'));
    expect(component.checked).toBeTrue();
    expect(component['_emitChangeEvent']).toHaveBeenCalled();
  });

  it('should handle onClickTargetRadioButton', () => {
    spyOn(component, 'onChangeRadioButton');
    spyOn(component._inputElement.nativeElement, 'focus');
    component.onClickTargetRadioButton(new Event('click'));
    expect(component.onChangeRadioButton).toHaveBeenCalled();
    expect(component._inputElement.nativeElement.focus).toHaveBeenCalled();
  });

  it('should destroy', () => {
    component.ngOnDestroy();
    // No se esperan expectativas, solo verificación de que no se produzcan errores.
  });
});
