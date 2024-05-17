import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from './card.component';
import { CardModule } from './card.module';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { By } from '@angular/platform-browser';
import { CardFooterDirective } from './card-footer/card-footer.directive';
import { CardHeaderDirective } from './card-header/card-header.directive';

@Component({
  template: `
    <neo-card labelCollpased="Título de la tarjeta" iconCollpased="icono" sizeIconCollapsed="s" [collapsable]="true">
      <neo-button
        class="neo-card__toggle-collapse"
        (onClick)="collapse($event)"
      >
        <i class="ri-arrow-up-wide-fill"></i>
      </neo-button>
      <neo-button
        class="neo-card__toggle-expand"
        (onClick)="expand($event)"
      >
        <i class="ri-arrow-down-wide-fill"></i>
      </neo-button>
      <neo-card-header>Header</neo-card-header>
      <neo-card-footer>Footer</neo-card-footer>
    </neo-card>
  `,
})
class TestHostComponent extends CardComponent { }

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TestHostComponent],
      imports: [
        CardModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],

    }).compileComponents();
    jasmine.addMatchers(toHaveNoViolations);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have collapsable option', () => {
    component.collapsable = true;
    expect(component.collapsable).toBe(true);
  });

  it('should have default collapsed state false', () => {
    component.expand();
    expect(component.isCollapsed()).toBe(false);
  });

  it('should contain header and footer directives', () => {
    const headerDirective = fixture.debugElement.query(By.directive(CardHeaderDirective));
    const footerDirective = fixture.debugElement.query(By.directive(CardFooterDirective));
    expect(headerDirective).toBeTruthy();
    expect(footerDirective).toBeTruthy();
  });

  it("should pass Card accessibility test", async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.labelCollpased = 'Título de la tarjeta';
    fixture.componentInstance.iconCollpased = 'icono';
    fixture.componentInstance.collapsable = true;
    fixture.componentInstance.sizeIconCollapsed = 's';
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
