import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyReprentiveComponent } from './companyreprentive.component';

describe('CompanyreprentiveComponent', () => {
  let component: CompanyReprentiveComponent;
  let fixture: ComponentFixture<CompanyReprentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyReprentiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyReprentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
