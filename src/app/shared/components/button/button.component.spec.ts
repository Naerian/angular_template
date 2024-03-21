import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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

  it('should initialize variables', () => {
    component.color = 'primary';
    component.size = 'm';
    component.type = 'button';
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
});
