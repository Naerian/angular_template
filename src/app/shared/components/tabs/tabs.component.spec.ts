import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsComponent } from './tabs.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from './tabs.module';
import { TabsItemComponent } from './tabs-item/tabs-item.component';
import { By } from '@angular/platform-browser';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TabsModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            children: [
              {
                url: ['test/test2/test3'],
              },
            ],
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('type tab', () => {
    component.orientation = 'v';
    component.type = 'tab';
    fixture.detectChanges();
    expect(component.type).toBe('tab');
  });

  it('type router-tab', () => {
    component.orientation = 'h';
    component.type = 'router-tab';
    fixture.detectChanges();
    expect(component.type).toBe('router-tab');
  });

  it('should select first tab by default', () => {
    const tabs = fixture.debugElement.children[0].queryAll(By.directive(TabsItemComponent));
    const selectedTab = tabs.find(tab => tab.componentInstance.isActiveTab());

    if (selectedTab)
      expect(selectedTab.componentInstance.title).toBe('Tab 1');
    else
      expect('No tab selected');
  });

  it('should set index', () => {
    const tabSelectedIdxSpy = spyOn(component.tabSelectedIdx, 'emit');
    component.setIndex(1);
    expect(tabSelectedIdxSpy).toHaveBeenCalledWith(1);
  });
});
