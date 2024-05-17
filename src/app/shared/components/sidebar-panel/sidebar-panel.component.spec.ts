import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { SidebarbarPanelEntity, SidebarbarPanelPosition, SidebarbarPanelSize } from './models/sidebar-panel.entity';
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
  let sidebarPanelService: SidebarPanelService;

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
    sidebarPanelService = TestBed.inject(SidebarPanelService);
    component.close();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close panel when escape key is pressed', () => {
    const closeSpy = spyOn(sidebarPanelService, 'close');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component._onKeydownHandler(event);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should set panel content when panel is visible', async () => {
    const content = {
      size: SidebarbarPanelSize.SMALL,
      position: SidebarbarPanelPosition.RIGHT,
      title: 'Panel Title',
      classes: ['extra-class'],
      component: MockComponent,
      inputs: []
    };
    component.isPanelVisible.set(true);
    const isPanelVisibleSpy = spyOn(sidebarPanelService, 'isPanelVisible').and.returnValue(new BehaviorSubject<boolean>(true));
    const panelContentChangedSpy = spyOn(sidebarPanelService, 'panelContentChanged').and.returnValue(new BehaviorSubject<any>(content));
    const panelContent = spyOn(sidebarPanelService, 'getPanelContent').and.returnValue(null);
    component.ngOnInit();
    expect(isPanelVisibleSpy).toHaveBeenCalled();
    expect(panelContentChangedSpy).toHaveBeenCalled();
    expect(panelContent).not.toHaveBeenCalled();
  });

  it('should set panel content when panel is visible and without content in observable', async () => {
    const content: SidebarbarPanelEntity = {
      size: SidebarbarPanelSize.SMALL,
      position: SidebarbarPanelPosition.RIGHT,
      title: 'Panel Title',
      classes: ['extra-class'],
      component: MockComponent,
      inputs: []
    } as SidebarbarPanelEntity;
    component.isPanelVisible.set(true);
    const isPanelVisibleSpy = spyOn(sidebarPanelService, 'isPanelVisible').and.returnValue(new BehaviorSubject<boolean>(true));
    const panelContentChangedSpy = spyOn(sidebarPanelService, 'panelContentChanged').and.returnValue(new BehaviorSubject<any>(null));
    const panelContent = spyOn(sidebarPanelService, 'getPanelContent').and.returnValue(content);
    component.ngOnInit();
    expect(isPanelVisibleSpy).toHaveBeenCalled();
    expect(panelContentChangedSpy).toHaveBeenCalled();
    expect(panelContent).toHaveBeenCalled();
  });

  it('close', () => {
    spyOn(component, 'close');
    component.close();
    fixture.detectChanges();
    expect(component.close).toHaveBeenCalled();
  });
});
