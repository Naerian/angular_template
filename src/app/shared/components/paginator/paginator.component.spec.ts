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

  it('should initialize default values', () => {
    component.ngOnInit();
    expect(component.pageSize).toEqual(0);
    expect(component.total).toEqual(0);
    expect(component.range).toEqual(2);
    expect(component.position).toEqual('right');
    expect(component.type).toEqual('rangenumber');
    expect(component.showLastFirstBtns).toEqual(true);
    expect(component.showTotal).toEqual(false);
    expect(component.currentPage).toEqual(1);
    expect(component.currentsResults).toEqual(0);
    expect(component.totalPages).toEqual(0);
    expect(component.totalResults).toEqual(0);
    expect(component.pages).toEqual([]);
  });

  it('should calculate total pages', () => {
    component.pageSize = 10;
    component.total = 100;
    component['setPagination']();
    expect(component.totalPages).toEqual(10);
  });

  it('should calculate total pages when total is 0', () => {
    component.pageSize = 10;
    component.total = 0;
    component['setPagination']();
    expect(component.totalPages).toEqual(1);
  });

  it('should calculate last page', () => {
    component.totalPages = 10;
    expect(component.getLastPage()).toEqual(10);
  });

  it('should set current page', () => {
    component.setCurrentPage(5);
    expect(component.currentPage).toEqual(5);
  });

  it('should emit page change event not called', () => {
    const emitSpy = spyOn(component.pageChange, 'emit');
    component.pageSelected(2);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit page change event ', () => {
    const emitSpy = spyOn(component.pageChange, 'emit');
    component.totalPages = 10;
    component.pageSelected(2);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit page change event if page is invalid', () => {
    const emitSpy = spyOn(component.pageChange, 'emit');
    component.total = 20;
    component.pageSize = 5;
    component.pageSelected(3);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should update total page results', () => {
    component.pageSize = 10;
    component.total = 100;
    component.currentPage = 2;
    expect(component.getTotalPageResults()).toEqual(20);
  });

  it('should update pages array for range number pagination type', () => {
    component.pageSize = 10;
    component.total = 100;
    component.currentPage = 2;
    component['setPagination']();
    expect(component.pages).toEqual([1, 2, 3, 4]);
  });

  it('should not update pages array for invalid pages', () => {
    component.pageSize = 10;
    component.total = 100;
    component.currentPage = 1;
    component['setPagination']();
    expect(component.pages).toEqual([1, 2, 3]);
  });


  it('is valid page', () => {
    expect(component.isValidPage(5, 100)).toBeTrue();
  });

  it('pageSelected', () => {
    var eventVar = jasmine.createSpyObj('eventVar', ['preventDefault']);
    component.pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    component.currentPage = 1
    component.totalPages = 199;
    component.pageSize = 3;
    component.total = 199;
    component.pageSelected(2, eventVar);
    fixture.detectChanges();
    expect(component.currentPage).toBe(2);
  });
});
