import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectComponent } from './select.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from './select.module';
import { OptionsDirective } from './options/options.directive';

@Component({
  selector: 'test-select',
  template: `<neo-select>
      <neo-option value="1"></neo-option>
      <neo-option value="2"></neo-option>
      <neo-option value="3"></neo-option>
    </neo-select>
    <div class="outside"></div>`,
})
class TestSelectComponent { }

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<TestSelectComponent>;

  let labelElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TestSelectComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectComponent);
    fixture.detectChanges();
    const wrapperCompDE = fixture.debugElement;
    const testedCompDE = wrapperCompDE.query(By.directive(SelectComponent));
    component = testedCompDE.componentInstance;
    labelElement = fixture.debugElement.query(By.css('label'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check if label is empty', () => {
    component.label = '';
    fixture.detectChanges();
    expect(labelElement).toBeFalsy();
  });

  it('setDisabledState', () => {
    component.setDisabledState(true);
  });

  it('onChange', () => {
    component.onChange(true);
  });

  it('onTouch', () => {
    component.onTouched();
  });

  it('toggleDropdown', () => {
    var eventVar = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.toggleDropdown(eventVar);
  });

  it('closeDropdown', () => {
    component.closeDropdown();
  });

  it('unselectOptions', () => {
    component.unselectOptions();
  });

  it('changeOption selected false', () => {
    const optionItem: OptionsDirective = {
      selected: false,
      value: 'tests',
      label: 'tests',
    } as OptionsDirective;
    component.multiple = true;
    fixture.detectChanges();
    component.changeOption(optionItem);
  });

  it('changeOption multiple', () => {
    const optionItem: OptionsDirective = {
      selected: false,
      value: 'tests',
      label: 'tests',
    } as OptionsDirective;
    component.multiple = true;
    component.changeOption(optionItem);
  });

  it('changeOption multiple false', () => {
    const optionItem: OptionsDirective = {
      selected: false,
      value: 'tests',
      label: 'tests',
    } as OptionsDirective;
    component.multiple = false;
    component.changeOption(optionItem);
  });

  it('writeValue multiple', () => {
    component.multiple = true;
    component.writeValue('prueba');
  });

});
