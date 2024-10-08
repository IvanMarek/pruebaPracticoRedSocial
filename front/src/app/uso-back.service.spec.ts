import { TestBed } from '@angular/core/testing';

import { UsoBackService } from './uso-back.service';

describe('UsoBackService', () => {
  let service: UsoBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsoBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
