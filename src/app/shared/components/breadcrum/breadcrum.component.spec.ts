import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumComponent } from './breadcrum.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { toHaveNoViolations, axe } from 'jasmine-axe';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { BreadCrumbEntity } from './models/breadcrum.entity';

describe('BreadcrumComponent', () => {
  let component: BreadcrumComponent;
  let fixture: ComponentFixture<BreadcrumComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BreadcrumComponent,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
    fixture = TestBed.createComponent(BreadcrumComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle navigation events', () => {
    spyOn(router.events, 'pipe').and.returnValue(of(new NavigationEnd(0, '/home/child', '/home/child')));
    spyOn(component, 'buildBreadCrumb').and.callThrough();
    component.ngOnInit();
    expect(component.buildBreadCrumb).toHaveBeenCalled();
  });

  it("should pass BreadCrum accessibility test", async () => {
    const fixture = TestBed.createComponent(BreadcrumComponent);
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
