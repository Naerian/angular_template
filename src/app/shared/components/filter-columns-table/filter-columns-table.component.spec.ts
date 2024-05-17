import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterColumnsTableComponent } from './filter-columns-table.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IColumnsFormat } from '@entities/table.entity';

describe('FilterColumnsTableComponent', () => {
  let component: FilterColumnsTableComponent;
  let fixture: ComponentFixture<FilterColumnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FilterColumnsTableComponent,
        CommonModule,
        OverlayModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterColumnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set columns', () => {
    const columns: IColumnsFormat[] = [{ def: 'Column1', visible: true, label: 'Column1' }, { def: 'Column2', visible: false, label: 'Column2' }] as IColumnsFormat[];
    component.columns = columns;
    expect(component['_columns']()).toEqual(columns);
  });

  it('should emit columnsChange', () => {
    spyOn(component.columnsChange, 'emit');
    const columns: IColumnsFormat[] = [{ def: 'Column1', visible: true, label: 'Column1' }, { def: 'Column2', visible: false, label: 'Column2' }] as IColumnsFormat[];
    component.columns = columns;
    component.columnsChange.emit(columns);
    expect(component.columnsChange.emit).toHaveBeenCalledWith(columns);
  });

  it('should change visibility of column', () => {
    const columns: IColumnsFormat[] = [{ def: 'Column1', visible: true, label: 'Column1' }, { def: 'Column2', visible: false, label: 'Column2' }] as IColumnsFormat[];
    component['_columns'].set(columns);
    component.changeVisibilityColumn(true, 1);
    expect(component['_columns']()[1].visible).toBeTrue();
  });

  it('should change visibility of all columns', () => {
    const columns: IColumnsFormat[] = [{ def: 'Column1', visible: true, label: 'Column1' }, { def: 'Column2', visible: false, label: 'Column2' }] as IColumnsFormat[];
    component['_columns'].set(columns);
    component.changeVisibilityAllColumns(true);
    expect(component['_columns']().every(column => column.visible)).toBeTrue();
  });

  it('should toggle overlay', () => {
    spyOn(component, 'isAllSelected');
    spyOn(component.isFiltersOpened, 'set');
    component.toggleOverlay(new Event('click'));
    expect(component.isAllSelected).toHaveBeenCalled();
    expect(component.isFiltersOpened.set).toHaveBeenCalled();
  });

  it('should close filters', () => {
    component.isFiltersOpened.set(true);
    component.closeFilters();
    expect(component.isFiltersOpened()).toBeFalse();
  });

  it("should pass FilterColumnsTable accessibility test", async () => {
    const fixture = TestBed.createComponent(FilterColumnsTableComponent);
    fixture.componentInstance.label = 'test';
    fixture.componentInstance.title = 'test';
    fixture.componentInstance.size = 'xm';
    fixture.componentInstance.color = 'primary';
    fixture.componentInstance.transparent = true;
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
