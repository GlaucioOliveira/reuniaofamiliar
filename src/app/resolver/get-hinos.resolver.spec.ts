import { TestBed } from '@angular/core/testing';

import { GetHinosResolver } from './get-hinos.resolver';

describe('GetHinosResolver', () => {
  let resolver: GetHinosResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetHinosResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
