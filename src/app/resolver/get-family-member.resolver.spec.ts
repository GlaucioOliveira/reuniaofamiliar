import { TestBed } from '@angular/core/testing';

import { GetFamilyMemberResolver } from './get-family-member.resolver';

describe('GetFamilyMemberResolver', () => {
  let resolver: GetFamilyMemberResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetFamilyMemberResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
