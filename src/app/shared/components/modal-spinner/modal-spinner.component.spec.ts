import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSpinnerComponent } from './modal-spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ModalSpinnerEntity } from './models/modal-spinner.entity';

describe('ModalSpinnerComponent', () => {
  let component: ModalSpinnerComponent;
  let fixture: ComponentFixture<ModalSpinnerComponent>;
  let data: ModalSpinnerEntity = {
    title: 'title'
  };
  const dialogMock = {
    close: () => { },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalSpinnerComponent,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
