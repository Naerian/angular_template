import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, Injectable, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuContextComponent } from './menu-context.component';
import { MenuContextModule } from './menu-context.module';
describe('MenuContextComponent', () => {
  let component: MenuContextComponent;
  let fixture: ComponentFixture<MenuContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MenuContextModule,
        TranslateModule.forRoot(),
        OverlayModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialize isMenuContextOpened a false', () => {
    expect(component.isMenuContextOpened()).toEqual(false);
  });

  it('should initialize variables ico and iconSize', () => {
    component.icon = 'menu2';
    component.size = 'xm';
    expect(component.icon).toBe('menu2');
    expect(component.size).toBe('xm');
  });

  it('should change isMenuContextOpened when execute toggleMenuContextContext', () => {
    component.isMenuContextOpened.set(false);
    var eventVar = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.toggleMenuContext(eventVar);
    expect(component.isMenuContextOpened()).toEqual(true);
  });

  it('toogleCalendar clientY 0', () => {
    component.isMenuContextOpened.set(false);
    var eventVar = jasmine.createSpyObj(
      'eventVar',
      ['preventDefault', 'stopPropagation'],
      {
        clientX: 0,
      }
    );
    component.toggleMenuContext(eventVar);
  });

  it('close menu context', () => {
    spyOn(component, 'close');
    component.isMenuContextOpened.set(true);
    component.close();
    fixture.detectChanges();
    expect(component.close).toHaveBeenCalled();
  });
});
