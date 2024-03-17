import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SidebarbarPanelEntity, SidebarbarPanelSize } from './models/sidebar-panel.entity';
import { SidebarPanelService } from './services/sidebar-panel.service';

import { SidebarPanelComponent } from './sidebar-panel.component';

@Component({
  selector: 'test-test',
  template: '<p>test</p>'
})
class MockComponent { }

describe('SidebarPanelComponent', () => {

  let component: SidebarPanelComponent;
  let fixture: ComponentFixture<SidebarPanelComponent>;
  let _sidebarPanelService: SidebarPanelService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPanelComponent);
    component = fixture.componentInstance;
    _sidebarPanelService = TestBed.inject(SidebarPanelService);
    component.close();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close', () => {
    spyOn(component, 'close');
    component.close();
    fixture.detectChanges();
    expect(component.close).toHaveBeenCalled();
  });
});
