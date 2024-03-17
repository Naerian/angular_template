import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { SidebarbarPanelEntity } from "../models/sidebar-panel.entity";

import { SidebarPanelService } from "./sidebar-panel.service";

let service: SidebarPanelService;
@Component({
  selector: 'test-component',
  template: '<p>Test</p>'
})
class MockTestComponent { }

describe("SidebarPanelService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(SidebarPanelService);
    service.close();
  });

  it("should be created", () => {
    const service: SidebarPanelService = TestBed.get(SidebarPanelService);
    expect(service).toBeTruthy();
  });

});
