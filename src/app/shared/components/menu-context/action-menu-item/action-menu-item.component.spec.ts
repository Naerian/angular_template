import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionMenuComponent } from '../action-menu.component';
import { ActionMenuItemComponent } from './action-menu-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MenuContextModule } from '../action-menu.module';

describe('ActionMenuItemComponent', () => {
  let component: ActionMenuItemComponent;
  let fixture: ComponentFixture<ActionMenuItemComponent>;
  let e: Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MenuContextModule,
        TranslateModule.forRoot(),
        OverlayModule
      ],
      providers: [ActionMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClickItem', () => {
    var eventVar = jasmine.createSpyObj('eventVar', [
      'preventDefault',
      'stopPropagation',
    ]);
    component.onClickItem(eventVar);
  });
});
