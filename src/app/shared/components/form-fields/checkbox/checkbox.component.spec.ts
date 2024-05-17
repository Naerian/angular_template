import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { FormsModule } from '@angular/forms';
import { InputsUtilsService } from '../services/inputs-utils.service';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CheckboxComponent,
        FormsModule
      ],
      providers: [InputsUtilsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should set id', () => {
    component.id = 'testId';
    expect(component.id).toBe('testId');
  });

  it('should set checked', () => {
    component.checked = true;
    expect(component.checked).toBeTrue();
  });

  it('should set indeterminate', () => {
    component.indeterminate = true;
    expect(component._checked()).toBeFalse();
    expect(component._indeterminate()).toBeTrue();
  });

  it('should set disabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('should create unique id', () => {
    component.createUniqueId();
    expect(component.id).toBeTruthy();
  });

  it('should emit change event on onClickTargetCheckbox', () => {
    spyOn(component.change, 'emit');
    component.onClickTargetCheckbox();
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('should call onChange on writeValue', () => {
    const checked = true;
    component.writeValue(checked);
    expect(component._checked()).toBeTrue();
  });

  it('should call registerOnChange', () => {
    const fn = () => {};
    spyOn(component, 'registerOnChange');
    component.registerOnChange(fn);
    expect(component.registerOnChange).toHaveBeenCalledWith(fn);
  });

  it('should call registerOnTouched', () => {
    const fn = () => {};
    spyOn(component, 'registerOnTouched');
    component.registerOnTouched(fn);
    expect(component.registerOnTouched).toHaveBeenCalledWith(fn);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it("should pass Checkbox accessibility test", async () => {
    const fixture = TestBed.createComponent(CheckboxComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.checked = false;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
