import { environment } from '@environments/environment';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        PaginatorComponent,
        TranslateModule.forRoot()
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is valid page', () => {
    expect(component.isValidPage(5, 100)).toBeTrue();
  });

  it('pageSelected', () => {
    var eventVar = jasmine.createSpyObj('eventVar', ['preventDefault']);
    component.pages.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    component.currentPage.set(1);
    component.totalPages.set(199);
    component.pageSize = 3;
    component.total = 199;
    component.pageSelected(2, eventVar);
    fixture.detectChanges();
    expect(component.currentPage()).toBe(2);
  });
});
