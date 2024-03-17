import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InputPasswordComponent } from './input-password.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('InputPasswordComponent', () => {
  let component: InputPasswordComponent;
  let fixture: ComponentFixture<InputPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        InputPasswordComponent,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('togglePassword password false -> true', () => {
    component.show.set(false);
    component.togglePassword(new Event('click'));
    expect(component.show()).toBeTruthy();
  });

  it('showPassword password false -> true', () => {
    component.show.set(false);
    component.showPassword();
    expect(component.show()).toBeTruthy();
  });

  it('hidePassword password true -> false', () => {
    component.show.set(true);
    component.hidePassword();
    expect(component.show()).toBeFalse();
  });

  it('input onInput', () => {
    component.onInput('test');
    expect(component.value).toBe('test');
  });

  it('input disabled', () => {
    component.disabled = false;
    expect(component.disabled).toBeFalse();
  });

  it('input enabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('value writeValue', () => {
    component.writeValue('test');
    expect(component.value).toBe('test');
  });
});
