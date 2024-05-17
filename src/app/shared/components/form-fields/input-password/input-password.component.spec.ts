import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InputPasswordComponent } from './input-password.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';

describe('InputPasswordComponent', () => {
  let component: InputPasswordComponent;
  let fixture: ComponentFixture<InputPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        InputPasswordComponent,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasswordComponent);
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

  it('should set value', () => {
    component.value = 'test';
    expect(component.value).toBe('test');
  });

  it('should call createUniqueId on ngAfterViewInit', () => {
    spyOn(component, 'createUniqueId');
    component.ngAfterViewInit();
    expect(component.createUniqueId).toHaveBeenCalled();
  });

  it('should call onChange, onTouched, and emit change event on onInput', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'onTouched');
    spyOn(component.change, 'emit');
    component.onInput('test');
    expect(component.onChange).toHaveBeenCalledWith('test');
    expect(component.onTouched).toHaveBeenCalled();
    expect(component.change.emit).toHaveBeenCalledWith('test');
  });

  it('should call onTouched on onBlur', () => {
    spyOn(component, 'onTouched');
    component.onBlur();
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should toggle show value on togglePassword', () => {
    component.show.set(false);
    component.togglePassword(new Event('click'));
    expect(component.show()).toBeTrue();
    component.togglePassword(new Event('click'));
    expect(component.show()).toBeFalse();
  });

  it('should set show to true on showPassword', () => {
    component.showPassword();
    expect(component.show()).toBeTrue();
  });

  it('should set show to false on hidePassword', () => {
    component.hidePassword();
    expect(component.show()).toBeFalse();
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

  it("should pass InputDatePicker accessibility test", async () => {
    const fixture = TestBed.createComponent(InputPasswordComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.placeholder = 'test';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.value = 'test';
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.autofocus = false;
    fixture.componentInstance.readonly = false;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
