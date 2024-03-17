import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsHeaderComponent } from './tabs-header.component';
import { TabsModule } from '../../tabs.module';

describe('TabsHeaderComponent', () => {
  let component: TabsHeaderComponent;
  let fixture: ComponentFixture<TabsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TabsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
