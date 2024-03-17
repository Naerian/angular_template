import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterColumnsTableComponent } from './filter-columns-table.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('FilterColumnsTableComponent', () => {
  let component: FilterColumnsTableComponent;
  let fixture: ComponentFixture<FilterColumnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FilterColumnsTableComponent,
        TranslateModule.forRoot()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterColumnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
