import { OverlayModule } from '@angular/cdk/overlay';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuContextComponent } from './menu-context.component';
import { MenuContextModule } from './menu-context.module';

@Component({
  selector: 'test-menu-context',
  template: ` <neo-menu-context size="xm">
    <neo-item-menu-context>Test 1</neo-item-menu-context>
    <neo-item-menu-context>Test 2</neo-item-menu-context>
  </neo-menu-context>`,
})
class TestMenuContextComponent extends MenuContextComponent {}

describe('MenuContextComponent', () => {
  let component: MenuContextComponent;
  let fixture: ComponentFixture<MenuContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [MenuContextModule, TranslateModule.forRoot(), OverlayModule],
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
});
