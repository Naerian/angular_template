import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuContextComponent } from '../menu-context.component';
import { ItemMenuContextComponent } from './item-menu-context.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MenuContextModule } from '../menu-context.module';

describe('ItemMenuContextComponent', () => {
  let component: ItemMenuContextComponent;
  let fixture: ComponentFixture<ItemMenuContextComponent>;
  let e: Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MenuContextModule,
        TranslateModule.forRoot(),
        OverlayModule
      ],
      providers: [MenuContextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMenuContextComponent);
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
