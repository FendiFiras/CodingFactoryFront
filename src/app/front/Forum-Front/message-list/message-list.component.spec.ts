import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message-list.component';  // Remplace MessageListComponent par MessageComponent

describe('MessageComponent', () => {  // Change également le nom du test pour correspondre
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent]  // Remplace MessageListComponent par MessageComponent ici aussi
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);  // Utilise MessageComponent ici aussi
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
