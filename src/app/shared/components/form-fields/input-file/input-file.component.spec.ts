import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFileComponent } from './input-file.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { FormsModule } from '@angular/forms';
import { InputsUtilsService } from '../services/inputs-utils.service';

describe('InputFileComponent', () => {
  let component: InputFileComponent;
  let fixture: ComponentFixture<InputFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [InputFileComponent, FormsModule],
      providers: [InputsUtilsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
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

  it('should set multiple', () => {
    component.multiple = true;
    expect(component.multiple).toBeTrue();
  });

  it('should call createUniqueId on ngAfterViewInit', () => {
    spyOn(component, 'createUniqueId');
    component.id = '';
    component.ngAfterViewInit();
    expect(component.createUniqueId).toHaveBeenCalled();
  });

  it('should emit filesSelected event on onFileChange', () => {
    const file = new File([''], 'test.txt');
    const files = {
      0: file,
      length: 1,
      item: (index: number) => file,
    } as FileList;
    spyOn(component.filesSelected, 'emit');
    component.onFileChange({ target: { files } } as unknown as Event);
    expect(component.filesSelected.emit).toHaveBeenCalledWith(files);
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

  it("should pass InputFile accessibility test", async () => {
    const fixture = TestBed.createComponent(InputFileComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.title = 'test';
    fixture.componentInstance.extensions = 'jpg';
    fixture.componentInstance.name = 'test';
    fixture.componentInstance.id = 'ID343';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.inputSize = 'm';
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
