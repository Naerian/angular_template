import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleModule } from './theme-toggle.module';
import { of } from 'rxjs';
import { ThemesService } from './service/themes.service';
import { DARK_THEME, LIGHT_THEME } from './model/theme.entity';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ThemeToggleModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial current theme', () => {
    let themesService = fixture.debugElement.injector.get(ThemesService);
    spyOn(themesService, 'getCurrentTheme').and.returnValue(LIGHT_THEME);
    component.ngOnInit();
    expect(component.currentTheme()).toEqual(LIGHT_THEME);
  });

  it('should toggle theme dark to light', () => {
    let themesService = fixture.debugElement.injector.get(ThemesService);
    spyOn(themesService, 'getCurrentTheme').and.returnValue(DARK_THEME);
    const _setTheme = spyOn(themesService, 'setTheme');
    component.toggleTheme(new MouseEvent('click'));
    expect(_setTheme).toHaveBeenCalled();
  });

  it('should toggle theme light to dark', () => {
    let themesService = fixture.debugElement.injector.get(ThemesService);
    spyOn(themesService, 'getCurrentTheme').and.returnValue(LIGHT_THEME);
    const _setTheme = spyOn(themesService, 'setTheme');
    component.toggleTheme(new MouseEvent('click'));
    expect(_setTheme).toHaveBeenCalled();
  });

  it('should not toggle theme if event is not provided', () => {
    let themesService = fixture.debugElement.injector.get(ThemesService);
    spyOn(themesService, 'getCurrentTheme').and.returnValue(LIGHT_THEME);
    const _setTheme = spyOn(themesService, 'setTheme');
    component.toggleTheme(new MouseEvent('click'));
    expect(_setTheme).toHaveBeenCalled();
  });
});
