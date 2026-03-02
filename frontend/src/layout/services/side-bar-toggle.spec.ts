import { TestBed } from '@angular/core/testing';

import { SideBarToggle } from './side-bar-toggle';

describe('SideBarToggle', () => {
  let service: SideBarToggle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideBarToggle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
