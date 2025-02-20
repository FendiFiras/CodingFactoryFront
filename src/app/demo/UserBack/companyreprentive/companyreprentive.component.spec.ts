import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyreprentiveComponent } from './companyreprentive.component';

describe('CompanyreprentiveComponent', () => {
  let component: CompanyreprentiveComponent;
  let fixture: ComponentFixture<CompanyreprentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyreprentiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyreprentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
