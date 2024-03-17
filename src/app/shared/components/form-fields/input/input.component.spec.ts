import {  HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InputComponent } from './input.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        InputComponent,
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue', () => {
    component.writeValue(true);
  });

  it('setDisabledState', () => {
    component.setDisabledState(true);
  });

  it('input disabled', () => {
    component.disabled = false;
    expect(component.disabled).toBeFalse();
  });

  it('input enabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
  });

  it('input value test', () => {
    component.value = 'test';
    expect(component.value).toBe('test');
  });
});
