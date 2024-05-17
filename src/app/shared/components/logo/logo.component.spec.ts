import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoComponent } from './logo.component';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { Component } from '@angular/core';
import { LIGHT_THEME, DARK_THEME } from '../theme-toggle/model/theme.entity';
import { ThemesService } from '../theme-toggle/service/themes.service';
import { LOGO, LOGO_DARK, LOGO_SMALL, LOGO_SMALL_DARK, LogoSize } from './models/logo.entity';

@Component({
  selector: 'test-logo',
  imports: [LogoComponent],
  template: `
  <neo-logo [size]="'s'" [alt]="'Text'"></neo-logo>`,
})
class TestLogoComponent { }

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    })
      .compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with light theme logo', () => {
    expect(component.logo).toBe(LOGO);
    expect(component.logoSmall).toBe(LOGO_SMALL);
  });

  it('should set default alt text', () => {
    expect(component.alt).toBe('logo');
  });

  it('should set provided alt text', () => {
    component.alt = 'My Logo';
    fixture.detectChanges();
    const logoElement: HTMLElement = fixture.nativeElement.querySelector('img');
    expect(logoElement.getAttribute('alt')).toBe('My Logo');
  });

  it('should set default size to medium', () => {
    expect(component.size).toBe('m');
  });

  it("should pass Logo accessibility test", async () => {
    const fixture = TestBed.createComponent(TestLogoComponent);
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
