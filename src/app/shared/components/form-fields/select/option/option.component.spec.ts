import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionComponent } from './option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from '../select.module';
import { ElementRef } from '@angular/core';

describe('OptionComponent', () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OptionComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        SelectModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when isSelected is called and option is selected', () => {
    component.selected = true;
    expect(component.isSelected()).toBeTruthy();
  });

  it('should return false when isSelected is called and option is not selected', () => {
    component.selected = false;
    expect(component.isSelected()).toBeFalsy();
  });

  it('should return true when hideOptionBySearch is called and option is hidden by search', () => {
    component.hideOptionBySearch();
    expect(component.isHideBySearch()).toBeTruthy();
  });

  it('should return false when hideOptionBySearch is called and option is not hidden by search', () => {
    component.showOptionBySearch();
    expect(component.isHideBySearch()).toBeFalsy();
  });

  it('should return label text when getLabelText is called', () => {
    component.setLabelText('Option Label');
    expect(component.getLabelText()).toEqual('Option Label');
  });

  it('should return label HTML when getLabelHtml is called', () => {
    component.setLabelHtml('<span>Option Label</span>');
    expect(component.getLabelHtml()).toEqual('<span>Option Label</span>');
  });

  it('should return elementRef when getElementRef is called', () => {
    const elementRef: ElementRef = component.getElementRef();
    expect(elementRef).toBeDefined();
  });

  it('should focus element when focus is called', () => {
    spyOn(component['_elementRef'].nativeElement, 'focus');
    component.focus();
    expect(component['_elementRef'].nativeElement.focus).toHaveBeenCalled();
  });
});
