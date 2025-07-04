import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { of } from 'rxjs';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BreadcrumbComponent,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
      ],
    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle navigation events', () => {
    spyOn(router.events, 'pipe').and.returnValue(
      of(new NavigationEnd(0, '/home/child', '/home/child')),
    );
    spyOn(component, 'buildBreadCrumb').and.callThrough();
    component.ngOnInit();
    expect(component.buildBreadCrumb).toHaveBeenCalled();
  });

  it('should pass BreadCrum accessibility test', async () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
