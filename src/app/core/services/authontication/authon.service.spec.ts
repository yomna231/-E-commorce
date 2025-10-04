import { TestBed } from '@angular/core/testing';

import { AuthonService } from './authon.service';

describe('AuthonService', () => {
  let service: AuthonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
