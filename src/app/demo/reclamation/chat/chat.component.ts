import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import { NavbarComponent } from 'src/app/front/elements/navbar/navbar.component';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,
        NavbarComponent,
        
        FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() reclamationId!: number;
  @Input() userType: 'user' | 'admin' = 'user';
  @Input() polling = true;
  @Output() close = new EventEmitter<void>();

  messages: Message[] = [];
  newMessage = '';
  private lastMessageId: number | null = null;
  private pollingSub?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMessages();

    if (this.polling) {
      this.pollingSub = timer(0, 3000).subscribe(() => this.loadMessages());
    }
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  loadMessages() {
    this.http.get<Message[]>(`http://localhost:8082/api/messages/reclamation/${this.reclamationId}`)
      .subscribe(msgs => {
        const latest = msgs[msgs.length - 1];
        if (!latest || latest.id !== this.lastMessageId) {
          this.messages = msgs;
          this.lastMessageId = latest?.id ?? null;
        }
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Partial<Message> = {
      sender: this.userType,
      content: this.newMessage,
      reclamation: { idReclamation: this.reclamationId }
    };

    this.http.post<Message>('http://localhost:8082/api/messages', message).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }

  closeChat() {
    this.close.emit();
  }
}
