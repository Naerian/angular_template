import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from './select.module';
import { Component } from '@angular/core';

@Component({
  selector: 'test-select',
  template: ` <neo-select [label]="'Selector con NG Model'">
    <neo-option value="1">Opción 1</neo-option>
    <neo-option value="2">Opción 2</neo-option>
    <neo-option [disabled]="true" value="3">Opción 3</neo-option>
  </neo-select>`,
})
class TestSelectComponent extends SelectComponent {}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
