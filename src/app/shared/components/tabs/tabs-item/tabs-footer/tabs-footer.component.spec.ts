import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsFooterComponent } from './tabs-footer.component';
import { TabsModule } from '../../tabs.module';

describe('TabsFooterComponent', () => {
  let component: TabsFooterComponent;
  let fixture: ComponentFixture<TabsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
