import { TestBed } from '@angular/core/testing';

import { DiagnosticapiService } from './diagnosticapi.service';

describe('DiagnosticapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagnosticapiService = TestBed.get(DiagnosticapiService);
    expect(service).toBeTruthy();
  });
});
