import { OverlayModule } from '@angular/cdk/overlay';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActionMenuComponent } from './action-menu.component';
import { MenuContextModule } from './action-menu.module';

@Component({
  selector: 'test-action-menu',
  template: ` <neo-action-menu size="xm">
    <neo-action-menu-item>Test 1</neo-action-menu-item>
    <neo-action-menu-item>Test 2</neo-action-menu-item>
  </neo-action-menu>`,
})
class TestActionMenuComponent extends ActionMenuComponent {}

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [MenuContextModule, TranslateModule.forRoot(), OverlayModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
