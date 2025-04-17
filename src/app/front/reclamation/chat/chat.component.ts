import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/app/models/message';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,
        NavbarComponent,
        BrowserModule,
        FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() reclamationId!: number;
  @Output() close = new EventEmitter<void>();

  messages: Message[] = [];
  newMessage = '';
  lastMessageId: number = 0;

  private pollingSub!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInitialMessages();

    this.pollingSub = timer(3000, 3000).subscribe(() => {
      this.fetchNewMessages();
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  loadInitialMessages() {
    this.http.get<Message[]>(`http://localhost:8082/api/messages/reclamation/${this.reclamationId}`)
      .subscribe((msgs) => {
        this.messages = msgs;
        this.lastMessageId = msgs[msgs.length - 1]?.id ?? 0;
        this.scrollToBottom();
      });
  }

  fetchNewMessages() {
    this.http.get<Message[]>(`http://localhost:8082/api/messages/reclamation/${this.reclamationId}`)
      .subscribe((msgs) => {
        const newMsgs = msgs.filter(msg => msg.id! > this.lastMessageId);
        if (newMsgs.length > 0) {
          this.messages.push(...newMsgs);
          this.lastMessageId = newMsgs[newMsgs.length - 1].id!;
          this.scrollToBottom();
        }
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Partial<Message> = {
      sender: 'user',
      content: this.newMessage,
      reclamation: { idReclamation: this.reclamationId }
    };

    this.newMessage = '';

    this.http.post<Message>('http://localhost:8082/api/messages', message).subscribe(() => {
      this.fetchNewMessages();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-box');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
