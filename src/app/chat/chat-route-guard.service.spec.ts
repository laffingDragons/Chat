import { TestBed, inject } from '@angular/core/testing';

import { ChatRouteGuardService } from './chat-route-guard.service';

describe('ChatRouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatRouteGuardService]
    });
  });

  it('should be created', inject([ChatRouteGuardService], (service: ChatRouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
