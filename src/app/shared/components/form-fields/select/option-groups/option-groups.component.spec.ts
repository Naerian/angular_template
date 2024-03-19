import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionGroupsComponent } from './option-groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from '../select.module';

describe('OptionGroupsComponent', () => {
  let component: OptionGroupsComponent;
  let fixture: ComponentFixture<OptionGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OptionGroupsComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        SelectModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
