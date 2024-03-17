import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsBodyComponent } from './tabs-body.component';
import { TabsModule } from '../../tabs.module';

describe('TabsBodyComponent', () => {
  let component: TabsBodyComponent;
  let fixture: ComponentFixture<TabsBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
