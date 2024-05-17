import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenToggleComponent } from './fullscreen-toggle.component';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { ButtonComponent } from '../button/button.component';

describe('FullscreenToggleComponent', () => {
  let component: FullscreenToggleComponent;
  let fixture: ComponentFixture<FullscreenToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ButtonComponent,
        FullscreenToggleComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle fullscreen mode', () => {
    spyOn(component.docElement, 'requestFullscreen');
    spyOn(document, 'exitFullscreen');
    component.isFullScreen.set(false);
    component.toggleFullScreen();
    expect(component.docElement.requestFullscreen).toHaveBeenCalled();
    component.isFullScreen.set(true);
    component.toggleFullScreen();
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it('should handle fullscreen change event', () => {
    const fullscreenChangeEvent = new Event('fullscreenchange');
    spyOnProperty(document, 'fullscreen').and.returnValue(true);
    component.isFullScreen.set(false);
    component.screenChange();
    expect(component.isFullScreen()).toBe(true);
  });

  it('should handle fullscreen change event', () => {
    const fullscreenChangeEvent = new Event('fullscreenchange');
    spyOnProperty(document, 'fullscreen').and.returnValue(false);
    component.isFullScreen.set(true);
    component.screenChange();
    expect(component.isFullScreen()).toBe(false);
  });

  it('should handle keydown event', () => {
    const keydownEvent = new KeyboardEvent('keydown', { key: 'F11' });
    spyOn(component, 'toggleFullScreen');
    document.dispatchEvent(keydownEvent);
    expect(component.toggleFullScreen).toHaveBeenCalled();
  });

  it("should pass FullScreenToggle accessibility test", async () => {
    const fixture = TestBed.createComponent(FullscreenToggleComponent);
    fixture.componentInstance.color = 'primary';
    fixture.componentInstance.size = 'm';
    fixture.componentInstance.transparent = false;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
