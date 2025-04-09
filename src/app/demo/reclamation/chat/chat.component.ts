import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarComponent } from 'src/app/front/elements/navbar/navbar.component';
import { Message } from 'src/app/Models/message';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,
        NavbarComponent,
        BrowserModule,
        FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  reclamationId = 1; // Static for now

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();
    setInterval(() => this.loadMessages(), 3000); // Polling every 3s
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const messageToSend = this.newMessage;
    this.newMessage = ''; // clear early to prevent double fire

    const message: Partial<Message> = {
      sender: 'admin',
      content: messageToSend,
      reclamation: { idReclamation: this.reclamationId } // ✅ correspond à l'entité Java
    };
    

    this.http.post<Message>('http://localhost:8082/api/messages', message).subscribe(() => {
      this.loadMessages();
    });
  }

  loadMessages(): void {
    this.http.get<Message[]>(`/api/messages/reclamation/${this.reclamationId}`)
      .subscribe(data => this.messages = data);
  }
}
