import { TestBed } from '@angular/core/testing';

import { NombreServicioService } from './uso-back.service';

describe('UsoBackService', () => {
  let service: NombreServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NombreServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
