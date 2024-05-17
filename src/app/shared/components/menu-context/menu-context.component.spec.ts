import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuContextComponent } from './menu-context.component';
import { MenuContextModule } from './menu-context.module';
import { axe, toHaveNoViolations } from 'jasmine-axe';

@Component({
  selector: 'test-menu-context',
  template: `
  <neo-menu-context size="xm">
    <neo-item-menu-context>Test 1</neo-item-menu-context>
    <neo-item-menu-context>Test 2</neo-item-menu-context>
  </neo-menu-context>`,
})
class TestMenuContextComponent extends MenuContextComponent { }

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
    jasmine.addMatchers(toHaveNoViolations);
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

  it("should pass MenuContext accessibility test", async () => {
    const fixture = TestBed.createComponent(TestMenuContextComponent);
    fixture.componentInstance.size = 'xm';
    fixture.componentInstance.title = 'title';
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
