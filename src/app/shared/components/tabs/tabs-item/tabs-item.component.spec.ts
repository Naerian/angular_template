import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsItemComponent } from './tabs-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsModule } from '../tabs.module';

describe('TabsItemComponent', () => {
  let component: TabsItemComponent;
  let fixture: ComponentFixture<TabsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TabsModule,
        TranslateModule.forRoot()
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a active Input', () => {
    expect(component.active).toBe(false);
    expect(component.isActive).toBe(false);
  });

  it('should have a label Input', () => {
    expect(component.title).toBe('');
  });

  it('should have a isActive property', () => {
    expect(component.isActive).toBe(false);
  });
});
