import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from './select.module';
import { Component, QueryList } from '@angular/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { OptionComponent } from './option/option.component';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';

@Component({
  selector: 'test-select',
  template: `
  <neo-select
      [label]="'Selector con NG Model'"
  >
    <neo-option value="1">Opción 1</neo-option>
    <neo-option value="2">Opción 2</neo-option>
    <neo-option [disabled]="true" value="3">Opción 3</neo-option>
  </neo-select>`,
})
class TestSelectComponent extends SelectComponent { }

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on option selection', () => {
    const option = new OptionComponent(null as any, null as any, null as any, null as any);
    option.value = 1;
    option.selected = true;
    spyOn(component.change, 'emit');
    component['_optionsSelected'] = { selected: [option], isEmpty: () => false, clear: () => false, select: () => true } as any;
    component.updateValue(option);
    expect(component.change.emit).toHaveBeenCalledWith(1);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

  it('should toggle dropdown true', () => {
    spyOn(component.isDropdownOpened, 'set');
    component.isDropdownOpened.set(false);
    component.toggleDropdown(new Event('click'));
    expect(component.isDropdownOpened.set).toHaveBeenCalledWith(true);
    component.isDropdownOpened.set(true);
    component.toggleDropdown(new Event('click'));
    expect(component.isDropdownOpened.set).toHaveBeenCalledWith(false);
  });

  it('should search option', () => {
    const option1 = new OptionComponent(null as any, null as any, null as any, null as any);
    option1['_labelText'] = 'Option 1';
    const option2 = new OptionComponent(null as any, null as any, null as any, null as any);
    option2['_labelText'] = 'Option 2';
    component.options = new QueryList<OptionComponent>();
    component.options.reset([option1, option2]);
    spyOn(option1, 'showOptionBySearch');
    spyOn(option2, 'showOptionBySearch');
    component.searchOption('option 1');
    expect(option1.showOptionBySearch).toHaveBeenCalled();
    expect(option2.showOptionBySearch).not.toHaveBeenCalled();
  });

  it('should reset search', () => {
    const option1 = new OptionComponent(null as any, null as any, null as any, null as any);
    const option2 = new OptionComponent(null as any, null as any, null as any, null as any);
    component.options = new QueryList<OptionComponent>();
    component.options.reset([option1, option2]);
    spyOn(option1, 'showOptionBySearch');
    spyOn(option2, 'showOptionBySearch');
    component.resetSearch();
    expect(option1.showOptionBySearch).toHaveBeenCalled();
    expect(option2.showOptionBySearch).toHaveBeenCalled();
  });

  it('should close dropdown', () => {
    component.isDropdownOpened.set(true);
    component.closeDropdown();
    expect(component.isDropdownOpened()).toBeFalsy();
  });

  it('should check errors', () => {
    spyOn(component, 'checkErrors');
    component.isDropdownOpened.set(true);
    component['_optionsSelected'] = { isEmpty: () => true } as any;
    component.checkErrors();
    expect(component.checkErrors).toHaveBeenCalled();
  });

  it('should deselect all options', () => {
    const option1 = new OptionComponent(null as any, null as any, null as any, null as any);
    const option2 = new OptionComponent(null as any, null as any, null as any, null as any);
    component['_optionsSelected'] = { clear: () => { }, isEmpty: () => true } as any;
    component.options = new QueryList<OptionComponent>();
    component.options.reset([option1, option2]);
    spyOn(option1, 'deselect');
    spyOn(option2, 'deselect');
    component.deselectAllOptions();
    expect(option1.deselect).toHaveBeenCalled();
    expect(option2.deselect).toHaveBeenCalled();
  });

  it('should get selected options', () => {
    const option1 = new OptionComponent(null as any, null as any, null as any, null as any);
    const option2 = new OptionComponent(null as any, null as any, null as any, null as any);
    component['_optionsSelected'] = { selected: [option1, option2] } as any;
    const selectedOptions = component.getSelectedOptions();
    expect(selectedOptions).toEqual([option1, option2]);
  });

  it('should get title options selected', () => {
    const option1 = new OptionComponent(null as any, null as any, null as any, null as any);
    option1['_labelText'] = 'Option 1';
    const option2 = new OptionComponent(null as any, null as any, null as any, null as any);
    option2['_labelText'] = 'Option 2';
    component['_optionsSelected'] = { selected: [option1, option2], isEmpty: () => false } as any;
    component.multiple = true;
    let titleOptionsSelected = component.getTitleOptionsSelected();
    expect(titleOptionsSelected).toEqual('Option 1, Option 2');
    component.multiple = false;
    titleOptionsSelected = component.getTitleOptionsSelected();
    expect(titleOptionsSelected).toEqual('Option 1');
  });

  it("should pass Select accessibility test", async () => {
    const fixture = TestBed.createComponent(TestSelectComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.placeholder = 'test';
    fixture.componentInstance.required = true;
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.value = 'test';
    fixture.componentInstance.inputSize = 'm';
    fixture.componentInstance.searchable = true;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
