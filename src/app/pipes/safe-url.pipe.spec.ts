import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeUrlPipe]
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sanitize a URL', () => {
    const unsafeUrl = 'http://example.com/test.pdf';
    const safeUrl = pipe.transform(unsafeUrl);
    expect(safeUrl).toBeTruthy(); // Vérifie que le pipe fonctionne bien
  });
});
