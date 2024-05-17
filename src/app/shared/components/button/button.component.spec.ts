import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { axe, toHaveNoViolations } from "jasmine-axe";
import { By } from '@angular/platform-browser';
import { ButtonMode, ButtonColor, ButtonSize, ButtonType } from './models/button.entity';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        ButtonComponent
      ],
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`mode has default value`, () => {
    expect(component.mode).toEqual(`button`);
  });

  it(`color has default value`, () => {
    expect(component.color).toEqual(`primary`);
  });

  it(`size has default value`, () => {
    expect(component.size).toEqual(`m`);
  });

  it(`type has default value`, () => {
    expect(component.type).toEqual(`button`);
  });

  it(`disabled has default value`, () => {
    expect(component.disabled).toEqual(false);
  });

  it(`focus has default value`, () => {
    expect(component.focus).toEqual(false);
  });

  it('onClick', () => {
    const eventClick = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.clickOnButton(eventClick);
  });

  it('should emit a value through a output', () => {
    const spy = spyOn(component.onClick, 'emit');
    const eventClick = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.clickOnButton(eventClick);
    expect(spy).toHaveBeenCalled();
  });

  it('should have default values', () => {
    expect(component.mode).toBe('button' as ButtonMode);
    expect(component.color).toBe('primary' as ButtonColor);
    expect(component.size).toBe('m' as ButtonSize);
    expect(component.disabled).toBe(false);
    expect(component.allWidth).toBe(false);
    expect(component.type).toBe('button' as ButtonType);
    expect(component.focus).toBe(false);
    expect(component.transparent).toBe(false);
    expect(component.title).toBe('');
  });

  it('should emit onClick event', () => {
    spyOn(component.onClick, 'emit');
    const buttonElement = fixture.debugElement.query(By.css('.neo-btn'));
    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(component.onClick.emit).toHaveBeenCalled();
  });

  it('should set title', () => {
    component.title = 'New title';
    expect(component.title).toBe('New title');
  });

  it('should focus and blur button', () => {
    spyOn(component.btnContent.nativeElement, 'focus');
    spyOn(component.btnContent.nativeElement, 'blur');
    component.focusButton();
    expect(component.btnContent.nativeElement.focus).toHaveBeenCalled();
    component.blurButton();
    expect(component.btnContent.nativeElement.blur).toHaveBeenCalled();
  });

  it('should get title', () => {
    component.title = 'Click me';
    const title = component.getTitle();
    expect(title).toBe('Click me');
  });

  it("should pass Button accessibility test", async () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentInstance.title = 'title';
    fixture.componentInstance.color = 'primary';
    fixture.componentInstance.size = 'm';
    fixture.componentInstance.disabled = false;
    fixture.componentInstance.allWidth = false;
    fixture.componentInstance.type = 'button';
    fixture.componentInstance.focus = false;
    fixture.componentInstance.transparent = false;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });

});
